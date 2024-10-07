import vine from '@vinejs/vine'

export const createTransferValidation = vine.compile(
  vine.object({
    pensions: vine.array(
      vine.object({
        currentPensionProvider: vine.string(),
        pensionPlanNumber: vine.string().trim(),
        pensionTransferValue: vine.string().trim(),
        pensionFullOrPartial: vine.string().trim(),
        pensionCashOrInSpecie: vine.string().trim(),
        pensionSchemeName: vine.string().trim().optional(),
        crystallisedUncrystallised: vine.number(),
      })
    ),
    platinumId: vine.string().optional(),
  })
)

export const createContribution = vine.compile(
  vine.object({
    contributionAmount: vine.number().positive(),
    contributionCurrency: vine.string(),
    employmentStatus: vine.string().optional(),
    contributeReclaimTaxRelief: vine.string().optional(),
    fundingResource: vine.array(vine.string()).optional(),
  })
)
