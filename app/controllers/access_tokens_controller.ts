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
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Non-httpOnly marker cookie — frontend reads this only to know "am I logged in?"
    // The real token above stays httpOnly and out of reach from JS.
    response.cookie('is_logged_in', 'true', {
      httpOnly: false,
      sameSite: 'none',
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
    response.clearCookie('is_logged_in')

    return response.ok({ message: 'Logged out successfully' })
  }
}