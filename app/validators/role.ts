import vine from '@vinejs/vine'

export const roleIndexValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)

export const roleValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(50),
    description: vine.string().maxLength(255).optional(),
  })
)
