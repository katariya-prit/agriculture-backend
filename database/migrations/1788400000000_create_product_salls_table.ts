import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crop_listings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('selling_account_id')
        .unsigned()
        .references('id')
        .inTable('selling_accounts')
        .onDelete('CASCADE')

      table.string('crop_name').notNullable()
      table.string('variety').nullable()
      table.string('unit').nullable().defaultTo('Quintal')
      table.decimal('price_per_unit', 10, 2).nullable()
      table.string('market').notNullable()
      table.date('harvest_date').nullable()
      table.string('contact_number', 15).notNullable()
      table.text('description').nullable()
      table.json('images').nullable()

      table.boolean('is_salled').defaultTo(false)
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}