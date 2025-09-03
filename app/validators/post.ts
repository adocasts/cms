import PostTypes from '#enums/post_types'
import vine from '@vinejs/vine'
import { exists } from './helpers/db.js'
import VideoTypes from '#enums/video_types'
import States from '#enums/states'
import PaywallTypes from '#enums/paywall_types'
import { DateTime } from 'luxon'
import CaptionTypes from '#enums/caption_types'
import CaptionLanguages from '#enums/caption_languages'

export const postIndexValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    perPage: vine.number().max(100).optional(),
    postTypeId: vine.number().enum(PostTypes).optional(),
    term: vine.string().optional(),
  })
)

export const postSearchValidator = vine.compile(
  vine.object({
    term: vine.string(),
    ignoreIds: vine.array(vine.number()).optional(),
    limit: vine.number().max(100).optional(),
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
          .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
          .first()
        return !result
      })
      .optional(),
    pageTitle: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().maxLength(255).optional(),
    canonical: vine.string().trim().maxLength(255).url().optional(),
    body: vine.string().trim().optional(),
    repositoryUrl: vine.string().trim().maxLength(255).url().optional(),
    isFeatured: vine.boolean().optional().nullable(),
    isLive: vine.boolean().nullable(),
    isUpdatingContent: vine.boolean().nullable(),
    videoTypeId: vine.number().enum(VideoTypes).optional(),
    videoUrl: vine.string().trim().maxLength(255).optional().nullable(),
    videoBunnyId: vine.string().trim().maxLength(500).optional().nullable(),
    videoSeconds: vine.number().optional(),
    timezone: vine.string().trim().optional(),
    publishAtDate: vine.date().optional(),
    publishAtTime: vine.date({ formats: ['HH:mm'] }).optional(),
    postTypeId: vine.number().enum(PostTypes).optional(),
    stateId: vine.number().enum(States).optional(),
    paywallTypeId: vine.number().enum(PaywallTypes).optional(),
    thumbnail: vine.object({
      id: vine.number().exists(exists('assets', 'id')).optional(),
      altText: vine.string().maxLength(100).optional(),
      credit: vine.string().maxLength(100).optional(),
    }),
    taxonomyIds: vine.array(vine.number().exists(exists('taxonomies', 'id'))).optional(),

    captions: vine
      .array(
        vine.object({
          id: vine.number().exists(exists('post_captions', 'id')).optional(),
          type: vine.enum(CaptionTypes),
          label: vine.string().maxLength(50).optional(),
          language: vine.enum(CaptionLanguages),
        })
      )
      .optional(),

    chapters: vine
      .array(
        vine.object({
          id: vine.number().exists(exists('post_chapters', 'id')).optional(),
          start: vine.string().regex(/^(?:[0-5]?[0-9]):([0-5]?[0-9])$/),
          end: vine.string().regex(/^(?:[0-5]?[0-9]):([0-5]?[0-9])$/),
          text: vine.string().maxLength(100),
        })
      )
      .optional(),

    publishAt: vine
      .computed()
      .requires(['publishAtDate', 'publishAtTime', 'timezone'])
      .transform((data) => {
        let publishAt = DateTime.now().setZone(data.timezone)

        if (data.publishAtDate) {
          const { year, month, day } = DateTime.fromFormat(data.publishAtDate, 'yyyy-MM-dd')
          publishAt = publishAt.set({ year, month, day })
        }

        if (data.publishAtTime) {
          const { hour, minute } = DateTime.fromFormat(data.publishAtTime, 'HH:mm')
          publishAt = publishAt.set({ hour, minute })
        }

        return publishAt.setZone('UTC').set({ second: 0, millisecond: 0 })
      }),
  })
)
