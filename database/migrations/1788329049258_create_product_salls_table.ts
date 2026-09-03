import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crop_listings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('crop_name').notNullable()
      table.string('variety').nullable()
      table.decimal('quantity', 10, 2).nullable()
      table.string('unit').nullable().defaultTo('Quintal')
      table.decimal('expected_price', 10, 2).nullable()
      table.string('quality').nullable().defaultTo('Standard')
      table.string('market_apmc').notNullable()
      table.date('harvest_date').nullable()
      table.string('contact_number', 15).notNullable()
      table.text('description').nullable()
      table.json('images').nullable()

      table.enum('status', ['pending', 'approved', 'sold', 'expired']).defaultTo('pending')
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}