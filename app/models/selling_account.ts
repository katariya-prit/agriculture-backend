import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class SellingAccount extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

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

  // ---- cropAndProductionInfo (optional) ----
  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
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
  declare updatedAt: DateTime

  /**
   * Profile completion % — runtime calculate, DB ma store nathi.
   * basicIdentity + farmAndLandDetails = required
   * cropAndProductionInfo = optional (checklist ma dekhay pan % ma na ganay)
   */
  @computed()
  get profileCompletion() {
    const requiredChecks = [
      { key: 'basicIdentity', label: 'Basic identity', done: !!(this.dateOfBirth && this.gender) },
      {
        key: 'farmAndLandDetails',
        label: 'Farm & land details',
        done: !!(this.village && this.taluka && this.district && this.pincode),
      },
    ]

    const optionalChecks = [
      {
        key: 'cropAndProductionInfo',
        label: 'Crop & production info (optional)',
        done: !!(this.primaryCrops?.length && this.cropSeason && this.farmingType),
      },
    ]

    const doneCount = requiredChecks.filter((c) => c.done).length
    const percent = Math.round((doneCount / requiredChecks.length) * 100)

    return { percent, checklist: [...requiredChecks, ...optionalChecks] }
  }
}