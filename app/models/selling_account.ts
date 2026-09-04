import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class SellingAccount extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  // ---- quickInfo ----
  @column()
  declare sellingAccountName: string

  @column()
  declare mobileNumber: string

  @column()
  declare mobileVerified: boolean

  @column()
  declare shortAddress: string

  @column()
  declare aadhaarNumber: string

  @column()
  declare aadhaarVerified: boolean

  // ---- basicIdentity ----
  @column()
  declare photoUrl: string | null

  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare gender: string | null

  // ---- farmAndLandDetails ----
  @column()
  declare village: string | null

  @column()
  declare taluka: string | null

  @column()
  declare district: string | null

  @column()
  declare state: string | null

  @column()
  declare pincode: string | null

  @column()
  declare surveyNumber: string | null

  // ---- cropAndProductionInfo ----
  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: unknown) => {
      if (!value) return null
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return null
        }
      }
      // Postgres 'json'/'jsonb' columns already auto-parsed by pg driver
      return value as string[]
    },
  })
  declare primaryCrops: string[] | null

  @column()
  declare cropSeason: string | null

  @column()
  declare expectedYieldValue: number | null

  @column()
  declare expectedYieldUnit: string | null

  @column()
  declare farmingType: string | null

  @column()
  declare soilType: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // ---- profileCompletion (computed, not stored) ----
  @computed()
  get profileCompletion() {
    const checklist = [
      { key: 'quickInfo', label: 'Selling account basic info', done: true },
      {
        key: 'identity',
        label: 'Basic identity',
        done: Boolean(this.dateOfBirth && this.gender),
      },
      {
        key: 'farm',
        label: 'Farm & land details',
        done: Boolean(this.village && this.taluka && this.district),
      },
      {
        key: 'crop',
        label: 'Crop & production info',
        done: Boolean(this.primaryCrops && this.primaryCrops.length > 0),
      },
    ]

    const done = checklist.filter((c) => c.done).length
    const percent = Math.round((done / checklist.length) * 100)

    return { percent, checklist }
  }
}