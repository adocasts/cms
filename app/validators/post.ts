import PostTypes from '#enums/post_types'
import vine from '@vinejs/vine'
import { exists, unique } from './helpers/db.js'
import VideoTypes from '#enums/video_types'
import States from '#enums/states'
import PaywallTypes from '#enums/paywall_types'

export const postIndexValidator = vine.compile(
  vine.object({
    postTypeId: vine.number().enum(PostTypes).optional(),
  })
)

export const postValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100),
    slug: vine
      .string()
      .trim()
      .maxLength(255)
      .unique(async (db, value, field) => {
        const result = await db
          .from('posts')
          .select('id')
          .whereILike('slug', value)
          .whereNot('id', field.data.id)
          .first()
        return !!result
      }),
    pageTitle: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().maxLength(255).optional(),
    canonical: vine.string().trim().maxLength(255).url().optional(),
    body: vine.string().trim().optional(),
    repositoryUrl: vine.string().trim().maxLength(255).url().optional(),
    isFeatured: vine.boolean().optional().nullable(),
    isLive: vine.boolean().nullable(),
    videoTypeId: vine.number().enum(VideoTypes).optional(),
    videoUrl: vine.string().trim().maxLength(255).url().optional().nullable(),
    videoBunnyId: vine.string().trim().maxLength(500).optional().nullable(),
    videoSeconds: vine.number().optional().nullable(),
    timezone: vine.string().trim().optional(),
    publishAtDate: vine.date({ formats: ['yyyy-MM-dd'] }).optional(),
    publishAtTime: vine.date({ formats: ['HH:mm'] }).optional(),
    postTypeId: vine.number().enum(PostTypes).optional(),
    stateId: vine.number().enum(States).optional(),
    paywallTypeId: vine.number().enum(PaywallTypes).optional(),
    thumbnail: vine
      .object({
        id: vine.number().exists(exists('assets', 'id')),
        altText: vine.string().maxLength(100).optional(),
        credit: vine.string().maxLength(100).optional().nullable(),
      })
      .optional()
      .nullable(),
    taxonomyIds: vine.array(vine.number().exists(exists('taxonomies', 'id'))).optional(),
  })
)
