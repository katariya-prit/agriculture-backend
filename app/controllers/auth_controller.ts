import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailService from '#services/email_service'
import { registerValidator, loginValidator, verifyEmailValidator } from '#validators/user'

export default class AuthController {
  /**
   * Signup — fakt username, fullName, email, password lai chhe.
   * Email verify na thay tya sudhi is_email_verified = false rahe chhe.
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const emailVerificationToken = EmailService.generateVerificationToken()

    const user = await User.create({
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      isEmailVerified: false,
      emailVerificationToken,
    })

    await EmailService.sendVerificationEmail({
      toEmail: user.email,
      fullName: user.fullName ?? user.username,
      token: emailVerificationToken,
    })

    return response.created({
      message: 'Account bani gayu. Email verify karva mate check karo.',
      user,
    })
  }

  /**
   * Email verify karva mate — link/OTP ma je token hoy e match karvanu.
   */
  async verifyEmail({ request, response }: HttpContext) {
    const { email, token } = await request.validateUsing(verifyEmailValidator)

    const user = await User.findBy('email', email)

    if (!user || user.emailVerificationToken !== token) {
      return response.badRequest({ message: 'Verification link khotu ke expire thai gayu chhe.' })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    await user.save()

    return response.ok({ message: 'Email verify thai gayu. Have login kari shakso.' })
  }

  /**
   * Login — email verify thayeli hovi farrjiyat chhe.
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    if (!user.isEmailVerified) {
      return response.forbidden({
        message: 'Login karva pahela email verify karo.',
      })
    }

    const token = await User.accessTokens.create(user)

    response.cookie('access_token', token.value!.release(), {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    await user.load((loader) => {
      loader.load('sellingAccount')
    })

    return response.ok({ user })
  }
}