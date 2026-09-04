import type { HttpContext } from '@adonisjs/core/http'
import ProductSall from '#models/product_sall'
import SellingAccount from '#models/selling_account'
import { createProductSallValidator, updateProductSallValidator } from '#validators/product_sall'
import ProductSallService from '#services/product_sall_service'

export default class ProductSallsController {
  // GET /product-salls
  async index({ response }: HttpContext) {
    const listings = await ProductSall.query()
      .where('is_active', true)
      .preload('user')
      .preload('sellingAccount')
      .orderBy('created_at', 'desc')
    return response.ok(listings)
  }

  // GET /product-salls/:id
  async show({ params, response }: HttpContext) {
    const listing = await ProductSall.query()
      .where('id', params.id)
      .preload('user')
      .preload('sellingAccount')
      .firstOrFail()
    return response.ok(listing)
  }

  // POST /product-salls
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    // Selling account joie j — nahi to product list na thai shake
    const sellingAccount = await SellingAccount.query().where('userId', user.id).first()
    if (!sellingAccount) {
      return response.badRequest({
        message: 'Pahela selling account banavo, pachi j product list karo.',
      })
    }

    const payload = await request.validateUsing(createProductSallValidator)

    const files = request.files('images', {
      size: '5gb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const listing = await ProductSallService.create(user.id, sellingAccount.id, payload, files)

    return response.created(listing)
  }

  // GET /product-salls/mine
  async myListings({ auth, response }: HttpContext) {
    const user = auth.user!
    const listings = await ProductSall.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('sellingAccount')
      .orderBy('created_at', 'desc')
    return response.ok(listings)
  }

  // PUT /product-salls/:id
  async update({ params, request, response }: HttpContext) {
    const listing = await ProductSall.findOrFail(params.id)
    const payload = await request.validateUsing(updateProductSallValidator)

    const files = request.files('images', {
      size: '5gb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const updated = await ProductSallService.update(listing, payload, files)

    return response.ok(updated)
  }

  // DELETE /product-salls/:id
  async destroy({ params, response }: HttpContext) {
    const listing = await ProductSall.findOrFail(params.id)
    await ProductSallService.delete(listing)

    return response.ok({ message: 'Deleted successfully' })
  }
}