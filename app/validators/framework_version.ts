import vine from '@vinejs/vine'

export const frameworkVersionIndexValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    perPage: vine.number().max(100).optional(),
    term: vine.string().optional(),
  })
)

export const frameworkVersionValidator = vine.compile(
  vine.object({
    framework: vine.string().trim().maxLength(100),
    version: vine.string().trim().maxLength(10),
    slug: vine
      .string()
      .trim()
      .maxLength(150)
      .unique(async (db, value, field) => {
        const result = await db
          .from('framework_versions')
          .select('id')
          .whereILike('slug', value)
          .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
          .first()
        return !result
      })
      .optional(),
  })
)
