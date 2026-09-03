import cloudinary from '#config/cloudinary'
import fs from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class CloudinaryService {
  /**
   * Ek file upload kare Cloudinary par ane URL return kare
   */
  static async uploadFile(file: MultipartFile, folder: string = 'product_salls') {
    if (!file.tmpPath) {
      throw new Error('File temp path not found')
    }

    const result = await cloudinary.uploader.upload(file.tmpPath, {
      folder,
    })

    // Temp file delete kari nakho
    if (fs.existsSync(file.tmpPath)) {
      fs.unlinkSync(file.tmpPath)
    }

    return result.secure_url
  }

  /**
   * Multiple files upload kare ane URLs nu array return kare
   */
  static async uploadMultiple(files: MultipartFile[], folder: string = 'product_salls') {
    const urls: string[] = []

    for (const file of files) {
      const url = await this.uploadFile(file, folder)
      urls.push(url)
    }

    return urls
  }

  static async deleteImage(imageUrl: string) {
    try {
      const parts = imageUrl.split('/')
      const fileName = parts[parts.length - 1].split('.')[0]
      const folder = parts[parts.length - 2]
      const publicId = `${folder}/${fileName}`

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Cloudinary delete error:', error)
    }
  }
}