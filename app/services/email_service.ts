import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

// Single source of truth — auth_controller.ts ahi thi j import kare chhe,
// jethi email no text ane actual expiry logic kadi mismatch na thay.
export const OTP_VALIDITY_MINUTES = 10

interface SendVerificationEmailPayload {
  toEmail: string
  fullName: string
  otp: string
}

export default class EmailService {
  /**
   * 6-digit numeric OTP banave (e.g. "482913").
   */
  static generateVerificationToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Verification OTP email Brevo SMTP thi mokle chhe.
   */
  static async sendVerificationEmail({ toEmail, fullName, otp }: SendVerificationEmailPayload) {
    await mail.send((message) => {
      message
        .to(toEmail)
        .from(env.get('MAIL_FROM_ADDRESS', 'noreply@farmloop.in'), env.get('MAIL_FROM_NAME', 'FarmLoop'))
        .subject(`${otp} — Tamaru FarmLoop verification code`)
        .html(`
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0B3D26;">Namaste ${fullName},</h2>
            <p>FarmLoop ma register karva badal aabhar. Email verify karva mate niche no code app ma nakho:</p>
            <div style="background: #EAF6EE; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0B3D26;">${otp}</span>
            </div>
            <p style="color: #5B6E63; font-size: 13px;">Aa code ${OTP_VALIDITY_MINUTES} minute mate j valid chhe.</p>
            <p style="color: #5B6E63; font-size: 13px;">Jo tame aa request nathi kari, to aa email ignore kari shako.</p>
          </div>
        `)
    })
  }
}