import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ user })
  }
}