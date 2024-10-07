import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transfers'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('IntegerPK')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('IntegerPK')
    })
  }
}
