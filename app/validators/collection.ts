import CollectionTypes from '#enums/collection_types'
import Difficulties from '#enums/difficulties'
import RepositoryAccessLevels from '#enums/repository_access_levels'
import States from '#enums/states'
import Status from '#enums/status'
import vine from '@vinejs/vine'
import { exists } from './helpers/db.js'

export const collectionIndexValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    perPage: vine.number().max(100).optional(),
    collectionTypeId: vine.number().enum(CollectionTypes).optional(),
    term: vine.string().optional(),
  })
)

export const collectionStubValidator = vine.compile(
  vine.object({
    parentId: vine.number().exists(exists('collections', 'id')),
    name: vine.string().maxLength(100).optional(),
  })
)

export const collectionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    slug: vine
      .string()
      .trim()
      .maxLength(150)
      .unique(async (db, value, field) => {
        const result = await db
          .from('collections')
          .select('id')
          .whereILike('slug', value)
          .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
          .first()
        return !result
      })
      .optional(),
    collectionTypeId: vine.number().enum(CollectionTypes).optional(),
    statusId: vine.number().enum(Status).optional(),
    stateId: vine.number().enum(States).optional(),
    difficultyId: vine.number().enum(Difficulties).optional(),
    pageTitle: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().maxLength(255).optional(),
    youtubePlaylistUrl: vine.string().trim().maxLength(255).nullable(),
    repositoryUrl: vine.string().trim().maxLength(255).nullable(),
    repositoryAccessLevel: vine.number().enum(RepositoryAccessLevels).optional(),
    taxonomyIds: vine.array(vine.number().exists(exists('taxonomies', 'id'))).optional(),
    frameworkVersionIds: vine
      .array(vine.number().exists(exists('framework_versions', 'id')))
      .optional(),
    asset: vine.object({
      id: vine.number().exists(exists('assets', 'id')).optional(),
      altText: vine.string().maxLength(100).optional(),
      credit: vine.string().maxLength(100).optional(),
    }),
  })
)

export const collectionContentValidator = vine.compile(
  vine.object({
    postIds: vine.array(vine.number().exists(exists('posts', 'id'))).optional(),
    subcollections: vine.array(
      vine.object({
        id: vine.number().exists(async (db, value, field) => {
          if (Number(value) < 0) return true // negatives indicate new records
          return exists('collections', 'id')(db, value, field)
        }),
        name: vine.string().trim().maxLength(100),
        postIds: vine.array(vine.number().exists(exists('posts', 'id'))).optional(),
      })
    ),
  })
)
