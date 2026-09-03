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
   * Selling account create — auth.user pase already selling_account_id
   * hoy to error, nahi to navu banavi ne users.selling_account_id set kare.
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.sellingAccountId) {
      return response.badRequest({ message: 'Tamaru selling account already banelu chhe.' })
    }

    const payload = await request.validateUsing(createSellingAccountValidator)

    const sellingAccount = await SellingAccount.create({
      userId: user.id,
      sellingAccountName: payload.sellingAccountName,
      mobileNumber: payload.mobileNumber,
      shortAddress: payload.shortAddress,
      aadhaarNumber: payload.aadhaarNumber,
      mobileVerified: false,
      aadhaarVerified: false, // free aadhaar-verification service add thaya pachi ahiya trigger karsu
    })

    user.sellingAccountId = sellingAccount.id
    await user.save()

    return response.created({ sellingAccount })
  }

  /**
   * Logged-in user nu potanu selling account + profile completion % batave.
   */
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load((loader) => {
      loader.load('sellingAccount')
    })

    if (!user.sellingAccount) {
      return response.notFound({ message: 'Selling account hajii banyu nathi.' })
    }

    return response.ok({ sellingAccount: user.sellingAccount })
  }

  /** Profile step 1 */
  async updateBasicIdentity({ auth, request, response }: HttpContext) {
    const sellingAccount = await this.#ownedAccountOrFail(auth)
    const payload = await request.validateUsing(updateBasicIdentityValidator)

    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }

  /** Profile step 2 */
  async updateFarmAndLandDetails({ auth, request, response }: HttpContext) {
    const sellingAccount = await this.#ownedAccountOrFail(auth)
    const payload = await request.validateUsing(updateFarmAndLandDetailsValidator)

    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }

  /** Profile step 3 — optional */
  async updateCropAndProductionInfo({ auth, request, response }: HttpContext) {
    const sellingAccount = await this.#ownedAccountOrFail(auth)
    const payload = await request.validateUsing(updateCropAndProductionInfoValidator)

    sellingAccount.merge(payload)
    await sellingAccount.save()

    return response.ok({ sellingAccount })
  }

  async #ownedAccountOrFail(auth: HttpContext['auth']) {
    const user = auth.getUserOrFail()
    if (!user.sellingAccountId) {
      throw new Error('Selling account nathi — pahela create karo.')
    }
    return await SellingAccount.findOrFail(user.sellingAccountId)
  }
}