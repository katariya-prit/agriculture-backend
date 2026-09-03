import type { HttpContext } from '@adonisjs/core/http'
import ProductSall from '#models/product_sall'
import { createProductSallValidator, updateProductSallValidator } from '#validators/product_sall'
import ProductSallService from '#services/product_sall_service'

export default class ProductSallsController {
  // GET /product-salls
  async index({ response }: HttpContext) {
    const listings = await ProductSall.query()
      .where('is_active', true)
      .preload('user')
      .orderBy('created_at', 'desc')
    return response.ok(listings)
  }

  // GET /product-salls/:id
  async show({ params, response }: HttpContext) {
    const listing = await ProductSall.query().where('id', params.id).preload('user').firstOrFail()
    return response.ok(listing)
  }

  // POST /product-salls
  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSallValidator)
    const user = auth.user!

    const files = request.files('images', {
      size: '5gb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const listing = await ProductSallService.create(user.id, payload, files)

    return response.created(listing)
  }

  async myListings({ auth, response }: HttpContext) {
    const user = auth.user!
    const listings = await ProductSall.query()
      .where('user_id', user.id)
      .preload('user')
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