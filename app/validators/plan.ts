import vine from '@vinejs/vine'

export const planIndexValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)

export const planValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(100),
    slug: vine
      .string()
      .trim()
      .maxLength(150)
      .unique(async (db, value, field) => {
        const result = await db
          .from('plans')
          .select('id')
          .whereILike('slug', value)
          .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
          .first()
        return !result
      })
      .optional(),
    description: vine.string().maxLength(255).optional(),
    stripePriceId: vine.string().minLength(3).maxLength(255).optional().nullable(),
    stripePriceTestId: vine.string().minLength(3).maxLength(255).optional().nullable(),
    price: vine.number().min(0),
    isActive: vine.boolean().optional(),
  })
)
