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

      // ---- User type ----
      table
        .enu('type', ['farmer', 'buyer', 'admin'])
        .notNullable()
        .defaultTo('farmer')

      // ---- Email verification ----
      table.boolean('is_email_verified').notNullable().defaultTo(false)
      table.string('email_verification_token').nullable()
      table.timestamp('email_verification_token_expires_at').nullable()

      // ---- Timestamps ----
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}