import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pending_registrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('username').notNullable()
      table.string('full_name').notNullable()
      table.string('email', 254).notNullable().unique()
      // NOTE: plain password ahiya temporarily store thay chhe (short-lived, OTP
      // expire/verify thata j delete thai jaay chhe) — verify thata j User model na
      // beforeSave hook e hash kari deshe jyare real user create thay.
      table.string('password').notNullable()

      table.string('otp', 6).notNullable()
      table.timestamp('otp_expires_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}