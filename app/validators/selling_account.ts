import vine from '@vinejs/vine'

export const createSellingAccountValidator = vine.compile(
  vine.object({
    sellingAccountName: vine.string().trim().minLength(2).maxLength(150),
    mobileNumber: vine.string().trim().mobile(),
    shortAddress: vine.string().trim().minLength(3).maxLength(255),
    aadhaarNumber: vine.string().trim().minLength(4),
  })
)

export const updateBasicIdentityValidator = vine.compile(
  vine.object({
    photoUrl: vine.string().trim().optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.enum(['Male', 'Female', 'Other'] as const).optional(),
  })
)

export const updateFarmAndLandDetailsValidator = vine.compile(
  vine.object({
    village: vine.string().trim().optional(),
    taluka: vine.string().trim().optional(),
    district: vine.string().trim().optional(),
    state: vine.string().trim().optional(),
    pincode: vine.string().trim().fixedLength(6).optional(),
    surveyNumber: vine.string().trim().optional(),
  })
)

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