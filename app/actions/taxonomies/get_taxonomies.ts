import Taxonomy from '#models/taxonomy'
import { taxonomyIndexValidator } from '#validators/taxonomy'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof taxonomyIndexValidator>

export default class GetTaxonomies {
  static async handle({ taxonomyTypeId, parentId }: Params) {
    return Taxonomy.query()
      .if(taxonomyTypeId, (query) => query.where({ taxonomyTypeId }))
      .if(parentId, (query) => query.where({ parentId }))
      .if(!parentId, (query) => query.whereNull('parentId'))
      .preload('parent')
      .withCount('children')
      .withCount('posts')
      .withCount('collections')
      .orderBy('name')
  }
}
