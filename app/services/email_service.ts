import { randomBytes } from 'node:crypto'

/**
 * Aa service email-related kaam alag rakhe chhe, jethi AuthController saaf rahe.
 * Actual email provider (Resend / Brevo / SMTP) nakki thaya pachi
 * `sendVerificationEmail` andar j badlvanu — baaki koi jagya e code change nahi karvo padse.
 */
export default class EmailService {
  /**
   * Random verification token banave — user create karta vakhate DB ma save karvanu.
   */
  static generateVerificationToken(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Verification email mokalvanu — have j fakt console.log chhe (TODO).
   * Provider nakki thay etle ahiya nodemailer/Resend/Brevo no actual call aavse.
   */
  static async sendVerificationEmail(params: {
    toEmail: string
    fullName: string
    token: string
  }) {
    const { toEmail, fullName, token } = params

    // TODO: real email provider ahiya call karvo.
    // Example structure (Resend vaparta):
    //
    // await resend.emails.send({
    //   from: 'FarmLoop <noreply@farmloop.in>',
    //   to: toEmail,
    //   subject: 'Email verify karo — FarmLoop',
    //   html: `<p>Namaste ${fullName},</p>
    //          <p>Aa link par click kari ne email verify karo:</p>
    //          <a href="https://yourapp.com/verify-email?email=${toEmail}&token=${token}">Verify karo</a>`,
    // })

    console.log(`[EmailService] Verification email — to: ${toEmail}, token: ${token}`)
  }

  /**
   * Selling account create thay tyare — jo koi welcome/notification email
   * mokalvi hoy to ahiya add karso.
   */
  static async sendSellingAccountCreatedEmail(params: { toEmail: string; sellingAccountName: string }) {
    const { toEmail, sellingAccountName } = params

    // TODO: real email provider
    console.log(`[EmailService] Selling account created — to: ${toEmail}, account: ${sellingAccountName}`)
  }
}