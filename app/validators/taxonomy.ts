import TaxonomyTypes from '#enums/taxonomy_types'
import vine from '@vinejs/vine'
import { exists } from './helpers/db.js'

export const taxonomyIndexValidator = vine.compile(
  vine.object({
    taxonomyTypeId: vine.number().enum(TaxonomyTypes).optional(),
    parentId: vine
      .number()
      .exists(async (db, value, field) => {
        if (!field.data.parentId) return true
        return exists('taxonomies', 'id')(db, value, field)
      })
      .optional()
      .nullable(),
  })
)

export const taxonomyCreateValidator = vine.compile(
  vine.object({
    parentId: vine
      .number()
      .exists(async (db, value, field) => {
        if (!field.data.parentId) return true
        return exists('taxonomies', 'id')(db, value, field)
      })
      .optional()
      .nullable(),
  })
)

export const taxonomyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    parentId: vine.number().exists(exists('taxonomies', 'id')).optional().nullable(),
    rootParentId: vine.number().exists(exists('taxonomies', 'id')).optional().nullable(),
    slug: vine
      .string()
      .trim()
      .maxLength(150)
      .unique(async (db, value, field) => {
        const result = await db
          .from('taxonomies')
          .select('id')
          .whereILike('slug', value)
          .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
          .first()
        return !result
      })
      .optional(),
    taxonomyTypeId: vine.number().enum(TaxonomyTypes).optional(),
    pageTitle: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().maxLength(255).optional(),
    asset: vine.object({
      id: vine.number().exists(exists('assets', 'id')).optional(),
      altText: vine.string().maxLength(100).optional(),
      credit: vine.string().maxLength(100).optional(),
    }),
  })
)

export const taxonomyContentValidator = vine.compile(
  vine.object({
    postIds: vine.array(vine.number()),
  })
)
