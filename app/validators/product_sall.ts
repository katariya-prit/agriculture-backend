import vine from '@vinejs/vine'

export const createProductSallValidator = vine.compile(
  vine.object({
    crop_name: vine.string().trim().minLength(2),
    variety: vine.string().trim().optional(),
    unit: vine.string().optional(),
    price_per_unit: vine.number().positive().optional(),
    market: vine.string().trim(),
    harvest_date: vine.date().optional(),
    contact_number: vine.string().mobile(),
    description: vine.string().optional(),
  })
)

export const updateProductSallValidator = vine.compile(
  vine.object({
    crop_name: vine.string().trim().minLength(2).optional(),
    variety: vine.string().trim().optional(),
    unit: vine.string().optional(),
    price_per_unit: vine.number().positive().optional(),
    market: vine.string().trim().optional(),
    harvest_date: vine.date().optional(),
    contact_number: vine.string().mobile().optional(),
    description: vine.string().optional(),
  })
)