import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CashTransactions extends BaseSchema {
  protected tableName = 'cash_transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('CashTransactionId').notNullable()
      table.timestamp('TransactionDate').notNullable()
      table.timestamp('SettlementDate').notNullable()
      table.string('Description').nullable()
      table.decimal('Credit', 15, 2).nullable()
      table.decimal('Debit', 15, 2).nullable()
      table.decimal('Balance', 15, 2).notNullable()
      table.string('TransactionType').notNullable()
      table.string('TransactionReference').nullable()
      table.timestamp('PostingDate').notNullable()
      table.string('TransactionStatus').notNullable()
      table.decimal('TotalCredit', 15, 2).notNullable()
      table.decimal('TotalDebit', 15, 2).notNullable()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('adviser_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('firm_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
