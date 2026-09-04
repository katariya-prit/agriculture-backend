import type { HttpContext } from '@adonisjs/core/http'
import SellingAccount from '#models/selling_account'
import {
  createSellingAccountValidator,
  updateBasicIdentityValidator,
  updateFarmAndLandDetailsValidator,
  updateCropAndProductionInfoValidator,
} from '#validators/selling_account'

export default class SellingAccountController {
  /**
   * POST /api/selling-account — pehli vaar account banave (quickInfo)
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createSellingAccountValidator)

    const existing = await SellingAccount.findBy('userId', user.id)
    if (existing) {
      return response.conflict({ message: 'Selling account already chhe.' })
    }

    const sellingAccount = await SellingAccount.create({
      userId: user.id,
      sellingAccountName: payload.sellingAccountName,
      mobileNumber: payload.mobileNumber,
      shortAddress: payload.shortAddress,
      aadhaarNumber: payload.aadhaarNumber,
    })

    user.sellingAccountId = sellingAccount.id
    await user.save()

    return response.created({ sellingAccount })
  }

  /**
   * GET /api/selling-account — current user nu selling account
   */
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const sellingAccount = await SellingAccount.findBy('userId', user.id)

    if (!sellingAccount) {
      return response.notFound({ message: 'Selling account nathi. Pehla banavo.' })
    }

    return response.ok({
      sellingAccount,
      profileCompletion: sellingAccount.profileCompletion,
    })
  }

  /**
   * PATCH /api/selling-account/basic-identity
   */
  async updateBasicIdentity({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateBasicIdentityValidator)

    const sellingAccount = await SellingAccount.findByOrFail('userId', user.id)
    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }

  /**
   * PATCH /api/selling-account/farm-details
   */
  async updateFarmAndLandDetails({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateFarmAndLandDetailsValidator)

    const sellingAccount = await SellingAccount.findByOrFail('userId', user.id)
    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }

  /**
   * PATCH /api/selling-account/crop-info
   */
  async updateCropAndProductionInfo({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateCropAndProductionInfoValidator)

    const sellingAccount = await SellingAccount.findByOrFail('userId', user.id)
    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }
}