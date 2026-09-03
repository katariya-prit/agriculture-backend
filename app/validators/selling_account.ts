import vine from '@vinejs/vine'

/**
 * Selling account create karta vakhate (quickInfo) — required
 */
export const createSellingAccountValidator = vine.compile(
  vine.object({
    sellingAccountName: vine.string().trim().minLength(2).maxLength(100),
    mobileNumber: vine.string().trim().mobile(),
    shortAddress: vine.string().trim().minLength(5).maxLength(255),
    aadhaarNumber: vine.string().trim().fixedLength(12),
  })
)

/**
 * Profile step 1 — basic identity
 */
export const updateBasicIdentityValidator = vine.compile(
  vine.object({
    photoUrl: vine.string().trim().url().optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.enum(['Male', 'Female', 'Other'] as const).optional(),
  })
)

/**
 * Profile step 2 — farm & land details
 */
export const updateFarmAndLandDetailsValidator = vine.compile(
  vine.object({
    village: vine.string().trim().maxLength(255).optional(),
    taluka: vine.string().trim().maxLength(255).optional(),
    district: vine.string().trim().maxLength(255).optional(),
    state: vine.string().trim().maxLength(255).optional(),
    pincode: vine.string().trim().fixedLength(6).optional(),
    surveyNumber: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Profile step 3 — crop & production info (fully optional group)
 */
export const updateCropAndProductionInfoValidator = vine.compile(
  vine.object({
    primaryCrops: vine.array(vine.string().trim()).optional(),
    cropSeason: vine.enum(['Kharif', 'Rabi', 'Zaid'] as const).optional(),
    expectedYieldValue: vine.number().positive().optional(),
    expectedYieldUnit: vine.string().trim().optional(),
    farmingType: vine.enum(['Organic', 'Conventional'] as const).optional(),
    soilType: vine.string().trim().optional(),
  })
)