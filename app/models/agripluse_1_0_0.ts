import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
} from '@adonisjs/lucid/orm'

export default class Agripluse100 extends BaseModel {
    public static table = 'agripluse_1_0_0'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number | null

    @column()
    declare message: string | null

    @column()
    declare language: string

    @column()
    declare imagePath: string | null

    // ---------------------------------------------------------
    // NEW: Python model no naya "gate" result - photo plant chhe ke nahi
    // ---------------------------------------------------------
    @column()
    declare isPlant: boolean | null

    // Jyare isPlant false hoy, athva confidence low hoy, to disease null rahe chhe.
    // Aa column have direct predict_plant() na "disease" field ne store kare chhe
    // (jem ke "Tomato___Early_Blight", "Potato___Healthy", etc.)
    @column()
    declare disease: string | null

    @column()
    declare confidence: number | null

    // Python side no user-facing message (jyare not-a-plant ke low-confidence hoy)
    @column()
    declare aiMessage: string | null

    // Badhi classes na raw probability scores - object form ma
    // e.g. { "Tomato___Healthy": 0.02, "Not_A_Plant": 0.91, ... }
    @column({
        prepare: (value: unknown) => JSON.stringify(value),
        consume: (value: string | null) =>
            value ? JSON.parse(value) : null,
    })
    declare rawProbs: Record<string, number> | null

    @column()
    declare aiResponse: string | null

    // ---------------------------------------------------------
    // LEGACY: purana fields - hamna use nathi thata (naya Python
    // response ma nathi aavta), pan existing DB rows tuti na jaay
    // etle rakhya chhe. Naya columns nathi joita to migration ma
    // drop kari shakay chhe.
    // ---------------------------------------------------------
    @column()
    declare crop: string | null

    @column()
    declare className: string | null

    @column()
    declare condition: Record<string, unknown> | null

    @column()
    declare probabilities: unknown[] | null

    @column()
    declare analysis: Record<string, unknown> | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}