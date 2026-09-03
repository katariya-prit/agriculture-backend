import vine from '@vinejs/vine'

export const createProductSallValidator = vine.compile(
  vine.object({
    crop_name: vine.string().trim().minLength(2),
    variety: vine.string().trim().optional(),
    quantity: vine.number().positive().optional(),
    unit: vine.string().optional(),
    expected_price: vine.number().positive().optional(),
    quality: vine.string().optional(),
    market_apmc: vine.string().trim(),
    harvest_date: vine.date().optional(),
    contact_number: vine.string().mobile(),
    description: vine.string().optional(),
  })
)

export const updateProductSallValidator = vine.compile(
  vine.object({
    crop_name: vine.string().trim().minLength(2).optional(),
    variety: vine.string().trim().optional(),
    quantity: vine.number().positive().optional(),
    unit: vine.string().optional(),
    expected_price: vine.number().positive().optional(),
    quality: vine.string().optional(),
    market_apmc: vine.string().trim().optional(),
    harvest_date: vine.date().optional(),
    contact_number: vine.string().mobile().optional(),
    description: vine.string().optional(),
  })
)