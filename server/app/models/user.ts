import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pension from './pension.js'
import Beneficiary from './beneficiary.js'
import Holding from './holding.js'
import ModelStructure from './model_structure.js'
import Performance from './performance.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contactNumber: string | null

  @column()
  declare isEmailVerified: boolean

  @column()
  declare isContactVerified: boolean

  @column()
  declare title: number | null

  @column()
  declare firstName: string | null

  @column()
  declare email: string

  @column()
  declare identityVerificationStatus: string

  @column()
  declare password: string

  @column()
  declare middlename: string | null

  @column()
  declare lastName: string

  @column()
  declare dateOfBirth: string

  @column()
  declare nationalInsuranceNumber: string

  @column({ columnName: 'address_line1' })
  declare addressLine1: string

  @column({ columnName: 'address_line2' })
  declare addressLine2: string | null

  @column()
  declare addressLine3: string

  @column()
  declare addressLine4: string | null

  @column()
  declare referrerName: string | null

  @column()
  declare city: string | null

  @column()
  declare zipCode: string | null

  @column()
  declare country: string | null

  @column()
  declare nationality: string

  @column()
  declare fundingSipp: string

  @column()
  declare contributionType: string

  @column()
  declare contributionCurrency: string

  @column()
  declare contributionAmount: string

  @column()
  declare employmentStatus: string

  @column()
  declare fundingResource: string

  @column()
  declare contributeReclaimTaxRelief: string

  @column()
  declare withdrawalFromPensions: string

  @column()
  declare pensionReclaimTaxRelief: string

  @column()
  declare baseCurrency: string

  @column()
  declare investmentOption: string

  @column()
  declare terceroClientId: string

  @column()
  declare terceroPortfolioId: string

  @column()
  declare terceroAccountId: string

  @column()
  declare terceroCashAccountId: string

  @column()
  declare plataniumMemberId: string

  @column()
  declare role: string

  @column()
  declare investmentObjectives: string

  @column()
  declare initialAdviceFee: string

  @column()
  declare ongoingAdviceFee: string

  @column()
  declare adviserId: number
  @belongsTo(() => User, {
    foreignKey: 'adviserId',
  })
  declare adviser: BelongsTo<typeof User>

  @column()
  declare networkFkId: number
  @belongsTo(() => User, {
    foreignKey: 'networkFkId',
  })
  declare network: BelongsTo<typeof User>

  @column()
  declare networkName: string

  @column()
  declare latestMarketValue: string

  @column()
  declare hearAboutUs: string

  @column()
  declare status: string

  @column()
  declare masterAuthorized: string

  @column()
  declare adviceFirmId: number
  @belongsTo(() => User, {
    foreignKey: 'adviceFirmId',
  })
  declare adviceFirm: BelongsTo<typeof User>

  @column()
  declare modelStructureName: string

  @column()
  declare adviceFeeCurrency: string

  @column()
  declare organisationId: string

  @column()
  declare networkId: string

  @column()
  declare intermediaryId: string

  @column()
  declare advisorId: string

  @column()
  declare individualRegulatoryNumber: string

  @column()
  declare branchId: number

  @column()
  declare isWelcomeMessageDisplayed: boolean

  @column()
  declare branchContactId: number

  static get hidden() {
    return ['password']
  }

  @column.dateTime()
  declare lastLogin: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Pension)
  declare pensions: HasMany<typeof Pension>

  @hasMany(() => Beneficiary)
  declare beneficiaries: HasMany<typeof Beneficiary>

  @hasOne(() => Holding)
  declare holding: HasOne<typeof Holding>

  @hasOne(() => Performance)
  declare performance: HasOne<typeof Performance>

  @hasMany(() => ModelStructure)
  declare modelStructure: HasMany<typeof ModelStructure>

  static withBeneficiaries() {
    return this.query().preload('beneficiaries', (builder) => {
      builder.orderBy('createdAt', 'desc') // Sort beneficiaries by createdAt in descending order
    })
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  static verificationEmailToken = DbAccessTokensProvider.forModel(User, {
    expiresIn: '15m',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
