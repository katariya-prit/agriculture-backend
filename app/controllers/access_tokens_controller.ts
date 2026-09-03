import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/user'

export default class AccessTokensController {
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    response.cookie('access_token', token.value!.release(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response.ok({ user })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    response.clearCookie('access_token')
    return response.ok({ message: 'Logged out successfully' })
  }
}