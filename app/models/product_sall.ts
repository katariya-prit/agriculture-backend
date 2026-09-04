import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SellingAccount from '#models/selling_account'

export default class ProductSall extends BaseModel {
  static table = 'crop_listings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare sellingAccountId: number

  @column()
  declare cropName: string

  @column()
  declare variety: string | null

  @column()
  declare unit: string | null

  @column()
  declare pricePerUnit: number | null

  @column()
  declare market: string

  @column.date()
  declare harvestDate: DateTime | null

  @column()
  declare contactNumber: string

  @column()
  declare description: string | null

  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: unknown) => {
      if (!value) return []
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value as string[]
    },
  })
  declare images: string[] | null

  @column()
  declare isSalled: boolean

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SellingAccount)
  declare sellingAccount: BelongsTo<typeof SellingAccount>
}