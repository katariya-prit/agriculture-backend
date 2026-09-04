import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'selling_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // ---- quickInfo ----
      table.string('selling_account_name').notNullable()
      table.string('mobile_number', 15).notNullable()
      table.boolean('mobile_verified').notNullable().defaultTo(false)
      table.string('short_address').notNullable()
      table.string('aadhaar_number', 20).notNullable()
      table.boolean('aadhaar_verified').notNullable().defaultTo(false)

      // ---- basicIdentity ----
      table.string('photo_url').nullable()
      table.date('date_of_birth').nullable()
      table.string('gender', 20).nullable()

      // ---- farmAndLandDetails ----
      table.string('village').nullable()
      table.string('taluka').nullable()
      table.string('district').nullable()
      table.string('state').nullable().defaultTo('Gujarat')
      table.string('pincode', 10).nullable()
      table.string('survey_number').nullable()

      // ---- cropAndProductionInfo ----
      table.json('primary_crops').nullable()
      table.string('crop_season', 20).nullable()
      table.decimal('expected_yield_value', 8, 2).nullable()
      table.string('expected_yield_unit', 20).nullable()
      table.string('farming_type', 30).nullable()
      table.string('soil_type').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}