import vine from '@vinejs/vine'

export const aiBodyOverviewValidator = vine.compile(
  vine.object({
    body: vine.string(),
  })
)
