import TaxonomyTypes from '#enums/taxonomy_types'
import vine from '@vinejs/vine'
import { exists } from './helpers/db.js'

export const taxonomyIndexValidator = vine.compile(
  vine.object({
    taxonomyTypeId: vine.number().enum(TaxonomyTypes).optional(),
    parentId: vine.number().exists(exists('taxonomies', 'id')).optional(),
  })
)
