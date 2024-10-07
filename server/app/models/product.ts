import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare selectProduct: string | null

  @column()
  declare adviceFee: string | null

  @column()
  declare adviceFeeCurrency: string | null

  @column()
  declare terceroPortfolioId: string | null

  @column()
  declare terceroAccountId: string | null

  @column()
  declare terceroCashAccountId: string | null

  @column()
  declare plataniumMemberId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
