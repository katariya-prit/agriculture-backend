import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs'
import GeminiCropAnalysisService, {
  type SupportedLanguage,
} from '#services/ai/gemini_crop_analysis_service'
import sharp from 'sharp'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['gu', 'hi', 'en']

function resolveLanguage(input: unknown): SupportedLanguage {
  return typeof input === 'string' && SUPPORTED_LANGUAGES.includes(input as SupportedLanguage)
    ? (input as SupportedLanguage)
    : 'gu'
}

export default class AiController {
  /** POST /api/ai/crop-analysis — fakt Gemini key vaparay chhe */
  async analyzeCropImage({ request, response }: HttpContext) {
    const image = request.file('image', { size: '15mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    if (!image) return response.badRequest({ success: false, message: 'Image file jarur chhe' })
    if (!image.isValid) return response.badRequest({ success: false, errors: image.errors })

    const userNote = request.input('message', '') as string
    const language = resolveLanguage(request.input('language'))

    try {
      const rawBuffer = fs.readFileSync(image.tmpPath!)

      // Image ne resize + compress karo, jethi Gemini ne moti file na jaay
      const imageBuffer = await sharp(rawBuffer)
        .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()

      const mimeType = 'image/jpeg' // sharp e JPEG ma convert karyu chhe

      const gemini = new GeminiCropAnalysisService()
      const result = await gemini.analyzeCropImage(imageBuffer, mimeType, language, userNote)

      return response.ok({ success: true, data: result })
    } catch (error: unknown) {
      return response.internalServerError({
        success: false,
        message: 'Crop analysis fail thayu',
        error: getErrorMessage(error),
      })
    }
  }

  /** POST /api/ai/gemini/chat */
  async chatWithGemini({ request, response }: HttpContext) {
    const message = request.input('message')
    const history = request.input('history', [])
    const language = resolveLanguage(request.input('language'))

    if (!message || typeof message !== 'string' || !message.trim()) {
      return response.badRequest({ success: false, message: 'Message jarur chhe' })
    }

    try {
      const service = new GeminiCropAnalysisService()
      const reply = await service.chatReply(message, Array.isArray(history) ? history : [], language)
      return response.ok({ success: true, data: { reply } })
    } catch (error: unknown) {
      return response.internalServerError({
        success: false,
        message: 'Chat reply fail thayu',
        error: getErrorMessage(error),
      })
    }
  }
}