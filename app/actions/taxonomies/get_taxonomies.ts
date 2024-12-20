import Taxonomy from '#models/taxonomy'
import { taxonomyIndexValidator } from '#validators/taxonomy'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof taxonomyIndexValidator>

export default class GetTaxonomies {
  static async handle({ taxonomyTypeId, parentId, rootParentId }: Params) {
    return Taxonomy.query()
      .if(taxonomyTypeId, (query) => query.where({ taxonomyTypeId }))
      .if(parentId, (query) => query.where({ parentId }))
      .if(rootParentId, (query) => query.where({ rootParentId }))
      .if(!parentId && !rootParentId, (query) => query.whereNull('parentId'))
      .preload('parent')
      .withCount('children')
      .withCount('posts')
      .withCount('collections')
      .orderBy('name')
  }
}
