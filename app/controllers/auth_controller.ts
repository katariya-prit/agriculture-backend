import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailService from '#services/email_service'
import { registerValidator, verifyEmailValidator } from '#validators/user'

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
}