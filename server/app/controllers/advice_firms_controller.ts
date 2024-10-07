import { HttpContext } from '@adonisjs/core/http'
import sgMail from '@sendgrid/mail'
import User from '#models/user'
import ModelPortfolio from '#models/model_portfolio'
import env from '#start/env';
import {
  createAdministratorsValidator,
  createModelPortfolioValidator,
} from '#validators/advisor_portal'
import { emailTemplate } from '../utils/email_template'
import { Roles } from '../utils/constants'

sgMail.setApiKey(env.get('SENDGRID_API_KEY2'))

// Define a type for the authUser to ensure we have a role property
interface AuthUser {
  role: string
  id: number
  organisationId?: number
  branchId?: number
  advice_firm_id?: number
  network_fk_id?: number
}

// Helper function for role validation
const validateRole = (authUser: AuthUser | null | undefined, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(authUser?.role ?? '')
}

// Define a standardized response format
const sendResponse = (
  response: HttpContext['response'],
  status: number,
  message: string,
  data: Record<string, any> = {}
) => {
  return response.status(status).json({
    status: status === 200,
    message,
    data
  })
}

export default class AdviceFirmsController {
  
  async getFinancialAdvisors({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM, Roles.MES_ADMINISTRATOR, Roles.NETWORK])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const page: number = request.input('page', 1)
      const limit: number = request.input('limit', 10)

      let query = User.query().where('role', 'financial_advisor')

      if (auth?.user?.role === Roles.ADVICE_FIRM) {
        query.andWhere('advice_firm_id', auth?.user?.id)
      } else if (auth?.user?.role === Roles.NETWORK) {
        query.whereIn('advice_firm_id', (builder) => {
          builder
            .select('id')
            .from('users')
            .where('role', Roles.ADVICE_FIRM)
            .andWhere('network_fk_id', auth?.user?.id)
        })
      }

      const adviceFirms = await query
        .preload('adviceFirm', (query) => query.select(['firstName', 'lastName', 'middleName']))
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return sendResponse(response, 200, 'Financial Advisors success', { adviceFirms })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while fetching financial advisors')
    }
  }

  async createAdministrators({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const { title, ...data } = await createAdministratorsValidator.validate(request.all())

      const adviceFirm = await User.create({
        ...data,
        adviceFirmId: auth?.user?.id,
        isEmailVerified: true,
        identityVerificationStatus: 'approved',
        role: 'administrator',
        status: 'pending',
        organisationId: auth?.user?.organisationId,
        branchId: auth?.user?.branchId,
      })

      const token = await User.accessTokens.create(adviceFirm)
      const url = `${env.get('ADVISER_FRONTEND_URL')}/set-password?resetToken=${token.value!.release()}`

      const msg = {
        to: data.email,
        from: { email: env.get('FROM_MAIL2'), name: 'MES Pensions' },
        subject: 'Setup Password',
        html: emailTemplate(url, 'Welcome to MES Advised Platform', 'Click the button below to set your password:', 'Set Password'),
      }

      sgMail.send(msg).catch((error) => {
        console.error('Email sending error:', error)
        if (error.response) {
          console.error('Email error details:', error.response.body)
        }
      })

      return sendResponse(response, 200, 'Administrator created successfully', { adviceFirm })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while creating an administrator')
    }
  }

  async getAdministrators({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM, Roles.MES_ADMINISTRATOR])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const page: number = request.input('page', 1)
      const limit: number = request.input('limit', 10)

      const query = User.query().where('role', 'administrator')
      if (auth?.user?.role === Roles.ADVICE_FIRM) {
        query.andWhere('advice_firm_id', auth?.user?.id)
      }

      const administrators = await query
        .preload('adviceFirm', (query) => query.select(['firstName', 'lastName', 'middleName']))
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return sendResponse(response, 200, 'Administrators fetched successfully', { administrators })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while fetching administrators')
    }
  }

  async getClients({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM, Roles.MES_ADMINISTRATOR, Roles.NETWORK])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const page: number = request.input('page', 1)
      const limit: number = request.input('limit', 10)
      const searchQuery: string = request.input('search', '').toLowerCase()
      const lowerSearchQuery = `%${searchQuery}%`

      let query = User.query().where('role', Roles.ADVISED_CLIENT)
      if (searchQuery) {
        query.andWhere((query) => {
          query
            .whereRaw('LOWER(first_name) LIKE ?', [lowerSearchQuery])
            .orWhereRaw('LOWER(last_name) LIKE ?', [lowerSearchQuery])
            .orWhereRaw("LOWER(CONCAT(first_name, ' ', last_name)) LIKE ?", [lowerSearchQuery])
        })
      }

      if (auth?.user?.role === Roles.ADVICE_FIRM) {
        query.andWhere('advice_firm_id', auth?.user?.id)
      } else if (auth?.user?.role === Roles.NETWORK) {
        query.whereIn('advice_firm_id', (builder) => {
          builder
            .select('id')
            .from('users')
            .where('role', Roles.ADVICE_FIRM)
            .andWhere('network_fk_id', auth?.user?.id)
        })
      }

      const clients = await query
        .preload('adviser')
        .preload('adviceFirm', (query) => query.select(['firstName', 'lastName', 'middleName']))
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return sendResponse(response, 200, 'Clients fetched successfully', { clients })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while fetching clients')
    }
  }

  async createModelPortfolio({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const data = await createModelPortfolioValidator.validate(request.all())

      const modelPortfolio = await ModelPortfolio.create({
        ...data,
        userId: auth?.user?.id,
      })

      return sendResponse(response, 200, 'Model Portfolio Created', { modelPortfolio })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while creating the model portfolio')
    }
  }

  async getModelPortfolios({ auth, request, response }: HttpContext) {
    try {
      if (!validateRole(auth?.user, [Roles.ADVICE_FIRM])) {
        return sendResponse(response, 404, 'You are not authorized for the request')
      }

      const page: number = request.input('page', 1)
      const limit: number = request.input('limit', 10)

      const modelPortfolios = await ModelPortfolio.query()
        .where('user_id', auth?.user?.id)
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return sendResponse(response, 200, 'Model Portfolios Fetched', { modelPortfolios })

    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'An error occurred while fetching model portfolios')
    }
  }
}
