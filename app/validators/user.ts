import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(30)
      .regex(/^[a-zA-Z0-9_.]+$/), // spaces/special chars nahi, sirf letters/numbers/_/.
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(6).maxLength(180),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

export const verifyEmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    token: vine.string().trim(),
  })
)