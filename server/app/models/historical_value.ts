import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class HistoricalValue extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'tercero_client_id' })
  declare terceroClientId: string

  @column({ columnName: 'portfolio_id' })
  declare portfolioId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare data: any

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
