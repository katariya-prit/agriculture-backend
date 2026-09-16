import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import PendingRegistration from '#models/pending_registration'
import EmailService from '#services/email_service'
import { registerValidator, verifyEmailValidator, resendVerificationValidator } from '#validators/user'

// OTP short-lived rakhvu joie — link jevu 24 kalak nahi, 6-digit code guessable hoy shake
const OTP_VALIDITY_MINUTES = 10

export default class AuthController {
  /**
   * Signup — `users` table ma KAI J insert NATHI thatu ahiya.
   * Sirf `pending_registrations` ma temporary data + OTP save thay chhe.
   * Real user OTP verify thata j `verifyEmail()` ma create thay chhe.
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    // Already verified/real user chhe ke nahi check karo
    const existingUser = await User.query()
      .where('email', payload.email)
      .orWhere('username', payload.username)
      .first()

    if (existingUser) {
      return response.badRequest({
        message: 'Aa email ya username thi pehla thi j account chhe.',
      })
    }

    const otp = EmailService.generateVerificationToken()
    const otpExpiresAt = DateTime.now().plus({ minutes: OTP_VALIDITY_MINUTES })

    // Same email thi fari signup try kare (pehla wala OTP verify nathi karyu) to
    // purana pending record ne overwrite kari nakho — navu OTP sathe.
    await PendingRegistration.updateOrCreate(
      { email: payload.email },
      {
        username: payload.username,
        fullName: payload.fullName,
        password: payload.password,
        otp,
        otpExpiresAt,
      }
    )

    console.log(`OTP for ${payload.email}: ${otp}`)

    try {
      await EmailService.sendVerificationEmail({
        toEmail: payload.email,
        fullName: payload.fullName,
        otp,
      })
    } catch (error) {
      console.error('Verification email mokalva ma fail thayu:', error)
      return response.internalServerError({
        message: 'OTP mokli na shakya. Fari try karo.',
      })
    }

    return response.created({
      message: 'Tamara email par OTP mokli didho chhe. Verify karo etle account bani jashe.',
    })
  }

  /**
   * OTP verify karva mate — sacho OTP hoy ane expire na thayu hoy TO J
   * real `users` row create thay chhe. Pending record pachi delete thai jaay chhe.
   */
  async verifyEmail({ request, response }: HttpContext) {
    const { email, token } = await request.validateUsing(verifyEmailValidator)

    const pending = await PendingRegistration.findBy('email', email)

    if (!pending || pending.otp !== token) {
      return response.badRequest({ message: 'OTP khotu chhe.' })
    }

    if (pending.otpExpiresAt < DateTime.now()) {
      return response.badRequest({
        message: 'OTP expire thai gayu chhe. Navu OTP mangavo.',
        expired: true,
      })
    }

    // Real account have j create thay chhe — password beforeSave hook thi hash thashe
    const user = await User.create({
      username: pending.username,
      fullName: pending.fullName,
      email: pending.email,
      password: pending.password,
      isEmailVerified: true,
    })

    await pending.delete()

    return response.ok({
      message: 'Email verify thai gayu ane account bani gayu. Have login kari shakso.',
      user,
    })
  }

  /**
   * OTP expire thai gayu hoy ke male na hoy — navu OTP mokalva mate.
   * (Sirf pending registrations mate — already-verified users mate nahi.)
   */
  async resendVerification({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(resendVerificationValidator)

    const pending = await PendingRegistration.findBy('email', email)

    // Pending registration exist nathi karto evu jaher na karo — email enumeration thi bachva
    if (!pending) {
      return response.ok({
        message: 'Jo aa email na pending registration hoy, to navu OTP mokli didhu chhe.',
      })
    }

    const otp = EmailService.generateVerificationToken()
    pending.otp = otp
    pending.otpExpiresAt = DateTime.now().plus({ minutes: OTP_VALIDITY_MINUTES })
    await pending.save()

    console.log(`OTP for ${pending.email}: ${otp}`)

    try {
      await EmailService.sendVerificationEmail({
        toEmail: pending.email,
        fullName: pending.fullName,
        otp,
      })
    } catch (error) {
      console.error('Verification email mokalva ma fail thayu:', error)
      return response.internalServerError({ message: 'OTP mokli na shakya. Fari try karo.' })
    }

    return response.ok({
      message: 'Jo aa email na pending registration hoy, to navu OTP mokli didhu chhe.',
    })
  }
}