import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
} from '@adonisjs/lucid/orm'

export default class AgripluseMap100 extends BaseModel {
    public static table = 'agripluse_map_1_0_0'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number | null

    @column()
    declare topic: string

    @column()
    declare language: string

    @column()
    declare mindmapData: Record<string, unknown> | null

    @column()
    declare aiResponse: string | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}