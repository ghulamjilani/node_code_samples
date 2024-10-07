import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash';
import sgMail from '@sendgrid/mail';
import { DateTime } from 'luxon';
import Twilio from 'twilio';

import User from '#models/user';
import env from '#start/env';
import {
  createUserValidator,
  emailCheckValidator,
  forgotPasswordValidator,
  loginUserValidator,
  phoneCheckValidator,
  resetPasswordValidator,
  verifyPhoneValidator,
} from '#validators/signup';
import { addBeneficiaries } from '#config/add_beneficiaries';
import { formatNameFortercero, isOlderThan75Years } from '../utils/custom_functions.js';
import { emailTemplate, sendContributionDetailsToAdmin } from '../utils/email_template.js';
import { Roles, countries } from '../utils/constants.js';
import {
  createAccount,
  createCashAccount,
  createClient,
  createContact,
  createPortfolio,
} from '../../api/tercero_apis.js';
import {
  getProfileInfo,
  getBeneficiaries,
  createBenefitsAdvice,
  createMember,
} from '../../api/platanium_apis.js';

// Initialize Twilio and SendGrid
const twilioClient = Twilio(env.get('TWILIO_ACCOUNT_SID'), env.get('TWILIO_AUTH_TOKEN'));
sgMail.setApiKey(env.get('SENDGRID_API_KEY2', ''));

// Define enums or types for specific constant values
type SchemeFK = { [key: string]: number };
type BrandFK = { [key: string]: number };

const schemeFK: SchemeFK = {
  'MES SIPP': 1,
  'MES Essentials SIPP': 1,
  'MES Adviser SIPP': 1,
  'MES Adviser SIPP II': 2,
  'MES SIPP II': 2,
};

const brandFK: BrandFK = {
  'MES SIPP': 1,
  'MES Essentials SIPP': 6,
  'MES Adviser SIPP': 2,
  'MES Adviser SIPP II': 4,
  'MES SIPP II': 3,
};

async function validatePhoneNumber(phoneNumber: string): Promise<boolean> {
  try {
    // Ensure the phone number is in E.164 format
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    await twilioClient.lookups.v1.phoneNumbers(phoneNumber).fetch({ type: ['carrier'] });
    return true;
  } catch (error) {
    if (error.status === 404 && error.code === 20404) {
      console.error('Phone number not found in Twilio lookup service:', phoneNumber);
    } else {
      console.error('Error validating phone number with Twilio:', error);
    }
    return false;
  }
}

export default class UsersController {
  // Signup API
  async signup({ request, response }: HttpContext): Promise<void> {
    try {
      const validatedData = await createUserValidator.validate(request.all());

      const {
        pensions,
        beneficiaries,
        sippProduct: sipp,
        fundingResource,
        title,
        fundingSipp,
        gender,
        ...user
      } = validatedData;

      const sippProduct = sipp ?? 'MES Essentials SIPP';
      user.baseCurrency = user.baseCurrency ?? 'GBP';
      user.middlename = user.middlename ?? '';

      // Create Tercero Client
      const client = await createClient({
        Name: formatNameFortercero(user),
        ReportingName: `${user.firstName} ${user.middlename} ${user.lastName}`,
        CurrencyISO: user.baseCurrency,
      });

      console.log(client, 'Client');

      // Create Tercero User Portfolio
      const portfolio = await createPortfolio({
        Name: sippProduct,
        ReportingName: `${user.firstName} ${user.middlename} ${user.lastName} - ${sippProduct}`,
        CurrencyISO: user.baseCurrency,
        PortfolioTypeId: '19', // 19 For Execution only and 18 for Advisory
        ServiceLevel: 'ExecutionOnly', // Either “Execution Only” or “Advisory”
        CollectiveName: sippProduct,
        Classification: 'D2C Clients', // Either “D2C Clients” or “Advised Clients”
        IntermediaryName: 'MES',
      }, client);

      console.log(portfolio, 'portfolio');

      // Create Tercero Account
      const account = await createAccount({
        Name: sippProduct,
        ReportingName: `${user.firstName} ${user.middlename} ${user.lastName} - ${sippProduct}`,
        CurrencyISO: user.baseCurrency,
        CollectiveName: sippProduct,
      }, client, portfolio);

      console.log(account, 'account');

      // Create Tercero Cash Account
      const cashAccount = await createCashAccount({
        Name: `SIPP Cash ${user.baseCurrency}`,
        CurrencyIso: user.baseCurrency,
        CashAccountTypes: ['Dealing', 'Income'],
      }, client, portfolio, account);

      console.log(cashAccount, 'cashAccount');

      // Create Contact
      const [CountryOfResidenceCrmGuid, NationalityCrmGuid] = [
        countries.find(country => country.IsoCode === user.country)?.CrmGuid,
        countries.find(country => country.IsoCode === user.nationality)?.CrmGuid,
      ];

      const contact = await createContact(client, {
        FirstNames: user.firstName,
        MiddleName: user.middlename,
        LastName: user.lastName,
        DateOfBirth: user.dateOfBirth,
        NationalInsuranceNumber: user.nationalInsuranceNumber,
        CountryOfResidenceCrmGuid,
        NationalityCrmGuid,
      });

      console.log(contact, 'Contact Created Successfully');

      // Create Member for Platinum
      const member = await createMember({
        SchemeDetails: {
          ProductType: 'SIPP',
          Scheme_FK: schemeFK[sippProduct],
          Brand_FK: brandFK[sippProduct],
          TransferIn: pensions?.length > 0,
        },
        PersonalDetails: {
          PensionOrigin: 'DeferredAnnuity',
          CommencementDate: new Date().toDateString(),
          DateOfBirth: user.dateOfBirth,
          Gender: gender,
          FirstName: user.firstName,
          SecondName: user.middlename,
          LastName: user.lastName,
          MemberStatus_FK: 10,
          NINumber: user.nationalInsuranceNumber,
          ProtectedRetirementAge: false,
          RUKI: isOlderThan75Years(user.dateOfBirth) || user.country !== 'GB',
          Title_FK: title,
        },
        CorrespondenceContactDetails: {
          Address1: user.addressLine1,
          Address2: user.addressLine2 || '',
          Country: user.country || '',
          ...(user.country === 'GB' && user.zipCode && { PostCode: user.zipCode }),
          ...(user.country !== 'GB' && user.zipCode && { Address3: user.zipCode }),
          Email: user.email,
          Mobile: user.contactNumber,
        },
      });

      console.log(member, 'Member');

      // Create Transfers on Platinum
      await addBeneficiaries(beneficiaries, member);

      const createUser = await User.create({
        ...user,
        terceroClientId: client,
        role: 'client',
        terceroPortfolioId: portfolio,
        terceroAccountId: account,
        terceroCashAccountId: cashAccount,
        plataniumMemberId: member,
        status: 'active',
      });

      if (user.contributionAmount) {
        // Send Contribution Details to Admin
        sendContributionDetailsToAdmin(createUser, { fundingResource, ...user });
      }

      const emailToken = await User.verificationEmailToken.create(createUser);
      const url = `${env.get('FRONTEND_URL')}/verify-email?verifyToken=${emailToken.value!.release()}`;

      const msg = {
        to: validatedData.email,
        from: { email: env.get('FROM_MAIL2', ''), name: 'MES Pensions' },
        subject: 'Email verification',
        text: 'Email verification',
        html: emailTemplate(
          url,
          'Welcome to MES Pensions',
          'Please click the button below to verify your email address. The link will expire after 15 minutes:',
          'Verify Email'
        ),
      };

      await sgMail.send(msg).catch(error => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      });

      response.status(200).json({
        message: 'We have received your application to open a SIPP. Please check your email inbox for a verification email.',
        data: { user: validatedData },
      });

      if (pensions?.length) {
        const oneDayOldDate = new Date();
        oneDayOldDate.setDate(oneDayOldDate.getDate() - 1);

        const benefitsData = {
          BenefitEventDate: oneDayOldDate,
          InitialEventType: 'TransferIn',
          SchemeName: sippProduct,
          MemberId: member,
          SchemeId: schemeFK[sippProduct],
          TransferAmount: pensions.reduce((total, pension) => total + pension.value, 0),
        };

        await createBenefitsAdvice(benefitsData);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  //  Check Unique Email At Signup
  async checkUniqueEmail({ request, response }: HttpContext) {
    try {
      const email = request.only(['email'])
      await emailCheckValidator.validate(email)

      response.status(200).json({ status: true, message: 'Email is unique' })
    } catch (error) {
      throw error
    }
  }

  // Check Unique contact Number at signup
  async checkUniqueContactNumber({ request, response }: HttpContext) {
    try {
      const contactNumber = request.only(['contactNumber'])
      await phoneCheckValidator.validate(contactNumber)

      const valid = await validatePhoneNumber(contactNumber?.contactNumber)

      if (!valid) {
        return response
          .status(422)
          .json({ status: true, errors: [{ message: 'Phone number is invalid' }] })
      }

      response.status(200).json({ status: true, message: 'Phone number is unique' })
    } catch (error) {
      throw error
    }
  }

  // Verify Email
  async verifyEmail({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      user.merge({ isEmailVerified: true })
      await user.save()

      // Twilio Verification
      await twilioClient.verify.v2
        .services(env.get('VERIFY_SID', ''))
        .verifications.create({ to: `${user?.contactNumber}`, channel: 'sms' })
        .then(() => {
          response.status(200).json({
            status: true,
            message: 'Your email is verified! Please verify your phone number now',
            data: { user },
          })
        })
        .catch((error) => response.status(200).json({ message: error.message, status: false }))
    } catch (error) {
      throw error
    }
  }

  // Verify Contact Number
  async verifyContactNumber({ request, auth, response }: HttpContext) {
    try {
      const { code } = await verifyPhoneValidator.validate(request.all())
      const user: any = auth.user!

      if (env.get('NODE_ENV') === 'production') {
        const verifyUser = await twilioClient.verify.v2
          .services(env.get('VERIFY_SID', ''))
          .verificationChecks.create({
            to: user.role === Roles.CLIENT ? `${user.contactNumber}` : `${user.email}`,
            code,
          })

        // TO Remove
        if (verifyUser.status !== 'approved')
          return response.status(400).json({
            message: 'Invalid Code !',
          })
      }

      await User.query()
        .where('contactNumber', user.contactNumber)
        .update({ isContactVerified: true })

      let loggedInUser = await User.withBeneficiaries().where('id', auth?.user?.id!).first()
      if (user.identityVerificationStatus === 'approved' || user?.role === 'super_admin') {
        const token = await User.accessTokens.create(user)

        return response.status(200).json({
          message: 'Login Successful',
          data: {
            user: loggedInUser,
            token: `Bearer ${token.value!.release()}`,
            isLogin: true,
          },
        })
      }

      const verifToken = await User.accessTokens.create(user)
      response.status(200).json({
        message: 'your phone number is verified',
        identityDecision: 'Pending',
        data: {
          user: loggedInUser,
          identityDecision: 'Pending',
          verifToken: `Bearer ${verifToken.value!.release()}`,
        },
      })
    } catch (error) {
      throw error
    }
  }

  //Login
  async signin({ request, response }: HttpContext) {
    try {
      const validatedData = await loginUserValidator.validate(request.all())
      const { email, password } = validatedData

      const user = await User.query().whereILike('email', email).first()

      if (!user)
        return response.status(401).json({
          message: 'User not found',
        })

      if (user.status !== 'active')
        return response.status(401).json({
          message: 'User not active',
        })

      const isPasswordValid = await hash.verify(user.password, password)

      if (!isPasswordValid)
        return response.status(401).json({
          message: 'Incorrect email or password',
        })

      // Update lastLogin field
      user.lastLogin = DateTime.local()
      await user.save()

      const verifyToken = await User.verificationEmailToken.create(user)

      if (!user.isEmailVerified) {
        let url =
          env.get('FRONTEND_URL') + '/verify-email?verifyToken=' + verifyToken.value!.release()

        const msg = {
          to: validatedData.email,
          from: { email: env.get('FROM_MAIL2', ''), name: 'MES Pensions' },
          subject: 'Email verification',
          text: 'Email verification',
          html: emailTemplate(
            url,
            'Welcome to MES Pensions',
            'Please click the button below to verify your email address. The link will expire after 15 minutes.',
            'Verify Email'
          ),
        }

        //TODO: make a separate function
        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error)

            if (error.response) {
              console.error(error.response.body)
            }
          }
        )
        return response.status(200).json({
          message: 'Your email is unverified. Check your inbox for the activation link',
          data: { user: validatedData },
        })
      }

      if (user?.role === Roles.ADVISED_CLIENT) {
        const token = await User.accessTokens.create(user)

        return response.status(200).json({
          message: 'Login Successful',
          status: true,
          data: {
            user,
            token: `Bearer ${token.value!.release()}`,
            isLogin: true,
          },
        })
      }

      response.status(200).json({
        status: true,
        message: 'Please verify your phone number ',
        data: { verifyToken: verifyToken.value!.release(), user },
      })

      // Twilio Verification
      //TODO: make a separate function

      // Comment out for staging

      if (env.get('NODE_ENV') === 'production') {
        await twilioClient.verify.v2
          .services(env.get('VERIFY_SID', ''))
          .verifications.create({
            to: user.role === Roles.CLIENT ? `${user.contactNumber}` : `${user.email}`,
            channel: user.role === Roles.CLIENT ? 'sms' : 'email',
          })
          .then(() => {
            return response.status(200).json({
              status: true,
              message: 'Please verify your phone number ',
              data: { verifyToken: verifyToken.value!.release(), user },
            })
          })
          .catch((error) => {
            console.log(error)
            response.status(200).json({ message: error.message, status: false })
          })
      }
    } catch (error) {
      throw error
    }
  }

  // Resend OTP
  async resendOtp({ params, response }: HttpContext) {
    try {
      const { id } = params
      const user = await User.query().where('id', id).first()

      if (!user) return response.status(404).json({ message: 'User not found' })

      const verifyToken = await User.verificationEmailToken.create(user)

      await twilioClient.verify.v2
        .services(env.get('VERIFY_SID', ''))
        .verifications.create({
          to: user.role === Roles.CLIENT ? `${user.contactNumber}` : `${user.email}`,
          channel: user.role === Roles.CLIENT ? 'sms' : 'email',
        })
        .then(() => {
          return response.status(200).json({
            status: true,
            message: 'Otp resend succussfully!',
            data: { verifyToken: verifyToken.value!.release(), user },
          })
        })
        .catch((error) => {
          console.log(error)
          response.status(400).json({ message: error.message, status: false })
        })
    } catch (error) {
      console.log(error)
    }
  }

  // User
  async getUser({ auth, response }: HttpContext) {
    let user = await User.withBeneficiaries().where('id', auth?.user?.id!).first()

    try {
      let profileInfo
      let beneficiaries

      if (user?.terceroClientId && user?.plataniumMemberId) {
        profileInfo = await getProfileInfo(user?.terceroClientId, user?.plataniumMemberId)
        beneficiaries = await getBeneficiaries(user?.plataniumMemberId)
      }

      response.status(200).json({
        message: 'User details',
        data: { user, profileInfo, beneficiaries },
      })
    } catch (error) {
      throw error
    }
  }

  // Reset Password
  async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = await forgotPasswordValidator.validate(request.all())

      const user = await User.query().where('email', email).first()

      if (!user)
        return response.status(401).json({
          message: 'User not found',
        })

      const FRONTEND_URL =
        user.role === Roles.CLIENT ? env.get('FRONTEND_URL') : env.get('ADVISER_FRONTEND_URL')

      const token = await User.verificationEmailToken.create(user)
      let url = FRONTEND_URL + '/reset-password?resetToken=' + token.value!.release()

      const msg = {
        to: email,
        from: { email: env.get('FROM_MAIL2', ''), name: 'MES Pensions' },
        subject: 'Password  Reset',
        text: 'Password Reset Request',
        html: emailTemplate(
          url,
          'MES Platform Password Reset',
          'We have received a request to reset the password for your MES account. Click the button below to reset your password. If you did not request this change, please contact us immediately.',
          'Reset Password'
        ),
      }

      sgMail.send(msg).then(
        () => {},
        (error) => {
          console.error(error)

          if (error.response) {
            console.error(error.response.body)
          }
        }
      )
      response.status(200).json({
        message: 'Please check your email for resetting the password!',
      })
    } catch (error) {
      throw error
    }
  }

  //Reset Password
  async resetPassword({ request, auth, response }: HttpContext) {
    const { password } = await resetPasswordValidator.validate(request.all())

    const user = await User.query()
      .where('email', auth?.user?.email || '')
      .first()

    if (!user)
      return response.status(401).json({
        message: 'User not found',
      })

    const hashedPassword = await hash.use('scrypt').make(password)

    await User.query()
      .where('email', user.email)
      .update('password', hashedPassword)
      .update('status', 'active')
      .first()

    response.status(200).json({
      message: 'Your password is changed successfully! Please login now',
    })
  }

  async welcomeMessageDisplayedAPI({ auth, response }: HttpContext) {
    try {
      const user = auth.user

      user?.merge({
        isWelcomeMessageDisplayed: true,
      })
      await user?.save()

      response.status(200).json({
        status: true,
        message: 'Success',
      })
    } catch (error) {
      throw error
    }
  }
}
