import ProductSall from '#models/product_sall'
import CloudinaryService from '#services/cloudinary_service'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class ProductSallService {
  static async create(userId: number, payload: any, files: MultipartFile[]) {
    let imageUrls: string[] = []

    if (files && files.length > 0) {
      imageUrls = await CloudinaryService.uploadMultiple(files, 'product_salls')
    }

    const listing = await ProductSall.create({
      userId,
      cropName: payload.crop_name,
      variety: payload.variety,
      quantity: payload.quantity,
      unit: payload.unit,
      expectedPrice: payload.expected_price,
      quality: payload.quality,
      marketApmc: payload.market_apmc,
      harvestDate: payload.harvest_date,
      contactNumber: payload.contact_number,
      description: payload.description,
      images: imageUrls,
    })

    return listing
  }

  static async update(listing: ProductSall, payload: any, files?: MultipartFile[]) {
    let imageUrls = listing.images || []

    if (files && files.length > 0) {
      const newUrls = await CloudinaryService.uploadMultiple(files, 'product_salls')
      imageUrls = [...imageUrls, ...newUrls]
    }

    listing.merge({
      cropName: payload.crop_name ?? listing.cropName,
      variety: payload.variety ?? listing.variety,
      quantity: payload.quantity ?? listing.quantity,
      unit: payload.unit ?? listing.unit,
      expectedPrice: payload.expected_price ?? listing.expectedPrice,
      quality: payload.quality ?? listing.quality,
      marketApmc: payload.market_apmc ?? listing.marketApmc,
      harvestDate: payload.harvest_date ?? listing.harvestDate,
      contactNumber: payload.contact_number ?? listing.contactNumber,
      description: payload.description ?? listing.description,
      images: imageUrls,
    })

    await listing.save()
    return listing
  }

  static async delete(listing: ProductSall) {
    // Cloudinary thi badhi images delete karo
    if (listing.images && listing.images.length > 0) {
      for (const url of listing.images) {
        await CloudinaryService.deleteImage(url)
      }
    }

    await listing.delete()
  }
}