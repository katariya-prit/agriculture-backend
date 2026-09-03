import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ---- Login / identity ----
      table.string('username').notNullable().unique()
      table.string('full_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      // ---- Email verification ----
      table.boolean('is_email_verified').notNullable().defaultTo(false)
      table.string('email_verification_token').nullable()

      // ---- Link to selling account (added later once selling_accounts exists) ----
      // See: alter_users_table_add_selling_account_id migration

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}