import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class ProductSall extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare cropName: string

  @column()
  declare variety: string | null

  @column()
  declare quantity: number | null

  @column()
  declare unit: string | null

  @column()
  declare expectedPrice: number | null

  @column()
  declare quality: string | null

  @column()
  declare marketApmc: string

  @column.date()
  declare harvestDate: DateTime | null

  @column()
  declare contactNumber: string

  @column()
  declare description: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare images: string[] | null

  @column()
  declare status: string

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}