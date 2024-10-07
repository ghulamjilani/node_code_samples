import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customMessages = {
  'FirstName.required': 'First name is required.',
  'FirstName.minLength': 'First name must be at least 3 characters long.',

  'SecondName.required': 'Second name is required.',
  'SecondName.minLength': 'Second name must be at least 3 characters long.',

  'LastName.required': 'Last name is required.',
  'LastName.minLength': 'Last name must be at least 3 characters long.',

  'DateOfBirth.required': 'Date of birth is required.',
  'DateOfBirth.minLength': 'Date of birth is required.',

  'Address1.required': 'Address Line 1 is required.',
  'Address1.minLength': 'Address Line 1 must be at least 3 characters long.',

  'Address2.required': 'Address Line 2 is required.',
  'Address2.minLength': 'Address Line 2 must be at least 3 characters long.',

  'Country.required': 'Country is required.',
  'Country.minLength': 'Country is required.',

  'ConcurrencyToken.required': 'Concurrency token is required.',

  'Mobile.required': 'Mobile number is required.',
  'Mobile.regex': 'Mobile number must be a valid format and between 8 to 12 digits long.',
}

// Set up the SimpleMessagesProvider with custom messages
vine.messagesProvider = new SimpleMessagesProvider(customMessages)

export const createUserValidator = vine.compile(
  vine.object({
    title: vine.number(),
    gender: vine.string(),
    firstName: vine.string().trim(),
    middlename: vine.string().trim().optional(),
    lastName: vine.string().trim(),
    password: vine.string().minLength(8),
    dateOfBirth: vine.string(),
    nationalInsuranceNumber: vine
      .string()
      .trim()
      .regex(/^[A-Za-z]{2}\d{6}[A-Za-z]$/),
    addressLine1: vine.string().trim(),
    addressLine2: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    zipCode: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    nationality: vine.string().trim().optional(),
    contactNumber: vine
      .string()
      .regex(/^[+]?[0-9]{8,12}$/)
      .trim()
      .unique(async (db, value) => {
        const user = await db.from('users').where('contact_number', value).first()
        return !user
      }),

    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    fundingSipp: vine.array(vine.string()).optional(),
    contributionCurrency: vine.string().trim().optional(),
    contributionAmount: vine.string().trim().optional(),
    employmentStatus: vine.string().trim().optional(),
    fundingResource: vine.array(vine.string()).optional(),
    contributeReclaimTaxRelief: vine.string().trim().optional(),

    pensions: vine
      .array(
        vine.object({
          currentPensionProvider: vine.string().optional(),
          pensionPlanNumber: vine.string().trim().optional(),
          pensionTransferValue: vine.string().trim().optional(),
          pensionFullOrPartial: vine.string().trim().optional(),
          pensionCashOrInSpecie: vine.string().trim().optional(),
          pensionSchemeName: vine.string().trim().optional(),
          crystallisedUncrystallised: vine.number().optional(),
        })
      )
      .optional(),

    beneficiaries: vine.array(
      vine.object({
        title: vine.number().optional(),
        beneficiaryFirstname: vine.string().trim().minLength(3).optional(),
        beneficiaryLastname: vine.string().trim().minLength(3).optional(),
        beneficiaryRelationship: vine.number(),
        beneficiaryProportion: vine.string().trim().minLength(1),
        beneficiaryAddressLine1: vine.string().trim().minLength(5),
        beneficiaryAddressLine2: vine.string().trim().minLength(5).optional(),
        country: vine.string().trim(),
        zipCode: vine.string().trim().optional(),
        organisationName: vine.string().trim().minLength(3).optional(),
      })
    ),

    pensionReclaimTaxRelief: vine.string().trim().optional(),
    baseCurrency: vine.string().trim().optional(),
    sippProduct: vine.string().trim().optional(),
    investmentOption: vine.string().trim().optional(),

    hearAboutUs: vine.string().trim().optional(),
    referrerName: vine.string().trim().optional(),
  })
)

export const previousClientValidator = vine.compile(
  vine.object({
    title: vine.number(),
    firstName: vine.string().trim(),
    middlename: vine.string().trim().optional(),
    lastName: vine.string().trim(),
    dateOfBirth: vine.string(),
    nationalInsuranceNumber: vine
      .string()
      .trim()
      .regex(/^[A-Za-z]{2}\d{6}[A-Za-z]$/),
    addressLine1: vine.string().trim(),
    addressLine2: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    zipCode: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    nationality: vine.string().trim().optional(),
    contactNumber: vine
      .string()
      .regex(/^[+]?[0-9]{8,12}$/)
      .trim()
      .unique(async (db, value) => {
        const user = await db.from('users').where('contact_number', value).first()
        return !user
      }),

    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    employmentStatus: vine.string().trim().optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    DateOfBirth: vine.string().minLength(1).optional(),
    Address1: vine.string().trim().minLength(2).optional(),
    Address2: vine.string().trim().minLength(2).optional(),
    Address3: vine.string().trim().minLength(2).optional(),
    Address4: vine.string().trim().minLength(3).optional(),
    Country: vine.string().trim().minLength(2).optional(),
    PostCode: vine.string().trim().optional().optional(),
    ConcurrencyToken: vine.string().trim(),
  })
)

export const emailCheckValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
  })
)

export const phoneCheckValidator = vine.compile(
  vine.object({
    contactNumber: vine
      .string()
      .regex(/^[+]?[0-9]{8,12}$/)
      .trim()
      .unique(async (db, value) => {
        const user = await db.from('users').where('contact_number', value).first()
        return !user
      }),
  })
)

export const verifyPhoneValidator = vine.compile(
  vine.object({
    code: vine.string().maxLength(6).minLength(6),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().trim().minLength(8),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().trim().minLength(8),
  })
)

export const updateAllRoleUsersValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    contactNumber: vine.string().trim().optional(),
    adviceFirmId: vine.number().optional(),
    branchContactId: vine.number().optional(),
    advisorId: vine.string().optional(),
    organisationId: vine.number().optional(),
    branchId: vine.number().optional(),
    networkFkId: vine.number().optional(),
    networkId: vine.number().optional(),
    intermediaryId: vine.string().optional(),
    selectedModelStructures: vine.array(vine.number()).optional(),
  })
)
