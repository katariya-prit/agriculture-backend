import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import EmailService, { OTP_VALIDITY_MINUTES } from '#services/email_service'
import { registerValidator, verifyEmailValidator, resendVerificationValidator } from '#validators/user'

export default class AuthController {
    /**
     * Signup — fakt username, fullName, email, password lai chhe.
     * Email verify na thay tya sudhi is_email_verified = false rahe chhe.
     */
    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)

        const otp = EmailService.generateVerificationToken()
        const emailVerificationTokenExpiresAt = DateTime.now().plus({ minutes: OTP_VALIDITY_MINUTES })

        const user = await User.create({
            username: payload.username,
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            isEmailVerified: false,
            emailVerificationToken: otp,
            emailVerificationTokenExpiresAt,
        })

        try {
            await EmailService.sendVerificationEmail({
                toEmail: user.email,
                fullName: user.fullName ?? user.username,
                otp,
            })
        } catch (error) {
            // Email fail thay to user ne pan delete kari nakho — nahi to "username already
            // exists" error aave chhe pan user pase koi verification code j na male hoy.
            await user.delete()
            return response.internalServerError({
                message: 'Account create thayu pan verification email mokli na shakya. Fari try karo.',
            })
        }

        return response.created({
            message: 'Account bani gayu. Tamara email par OTP mokli didho chhe.',
            user,
        })
    }

    /**
     * Email verify karva mate — user e email ma malel 6-digit OTP submit kare chhe.
     * OTP OTP_VALIDITY_MINUTES mate j valid rahe chhe.
     */
    async verifyEmail({ request, response }: HttpContext) {
        const { email, token } = await request.validateUsing(verifyEmailValidator)

        const user = await User.findBy('email', email)

        if (!user || user.emailVerificationToken !== token) {
            return response.badRequest({ message: 'OTP khotu chhe.' })
        }

        const expiresAt = user.emailVerificationTokenExpiresAt
        if (!expiresAt || expiresAt < DateTime.now()) {
            return response.badRequest({
                message: 'OTP expire thai gayu chhe. Navu OTP mangavo.',
                expired: true,
            })
        }

        user.isEmailVerified = true
        user.emailVerificationToken = null
        user.emailVerificationTokenExpiresAt = null
        await user.save()

        return response.ok({ message: 'Email verify thai gayu. Have login kari shakso.' })
    }

    /**
     * OTP expire thai gayu hoy ke male na hoy — navu OTP mokalva mate.
     */
    async resendVerification({ request, response }: HttpContext) {
        const { email } = await request.validateUsing(resendVerificationValidator)

        const user = await User.findBy('email', email)

        // User exist nathi karto evu jaher na karo — email enumeration attack thi bachva mate
        if (!user || user.isEmailVerified) {
            return response.ok({
                message: 'Jo aa email registered ane unverified hoy, to navu OTP mokli didhu chhe.',
            })
        }

        const otp = EmailService.generateVerificationToken()
        user.emailVerificationToken = otp
        user.emailVerificationTokenExpiresAt = DateTime.now().plus({ minutes: OTP_VALIDITY_MINUTES })
        await user.save()

        await EmailService.sendVerificationEmail({
            toEmail: user.email,
            fullName: user.fullName ?? user.username,
            otp,
        })

        return response.ok({
            message: 'Jo aa email registered ane unverified hoy, to navu OTP mokli didhu chhe.',
        })
    }
}