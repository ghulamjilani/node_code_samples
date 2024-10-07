import vine from '@vinejs/vine'

export const createAdviceFirms = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(3),
    intermediaryId: vine.string().trim().minLength(3),
    organisationId: vine.number(),
    branchId: vine.number(),
    networkId: vine.string().trim().minLength(1).optional(),

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

export const createMESAdministratorValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(3),
    lastName: vine.string().trim().minLength(3),
    addressLine1: vine.string().trim().minLength(5),
    country: vine.string().trim(),
    contactNumber: vine
      .string()
      .regex(/^\+[0-9]{8,12}$/)
      .trim(),

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

export const createFinancialAdvisors = vine.compile(
  vine.object({
    title: vine.number(),
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    adviceFirmId: vine.number(),
    advisorId: vine.string().trim(),
    branchContactId: vine.number(),

    contactNumber: vine
      .string()
      .regex(/^\+[0-9]{8,13}$/)
      .trim(),

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

export const createAdministratorsValidator = vine.compile(
  vine.object({
    title: vine.number(),

    firstName: vine.string().trim(),
    lastName: vine.string().trim(),

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

export const createModelPortfolioValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    riskLevel: vine.string().trim(),
    targetAssetAllocation: vine.string().trim(),
    investmentOptions: vine.string().trim(),
  })
)
