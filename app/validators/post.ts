import PostTypes from '#enums/post_types'
import vine from '@vinejs/vine'

export const postIndexValidator = vine.compile(
  vine.object({
    postTypeId: vine.number().enum(PostTypes).optional(),
  })
)
