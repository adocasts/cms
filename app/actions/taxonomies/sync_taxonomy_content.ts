import Taxonomy from '#models/taxonomy'
import { taxonomyContentValidator } from '#validators/taxonomy'
import { Infer } from '@vinejs/vine/types'

type Params = {
  taxonomy: Taxonomy
  data: Infer<typeof taxonomyContentValidator>
}

type SortedReducer = Record<number, { sort_order: number }>

export default class SyncTaxonomyContent {
  static async handle({ taxonomy, data }: Params) {
    const posts = data.postIds.reduce<SortedReducer>(
      (acc, id, index) => ({
        ...acc,
        [id]: { sort_order: index },
      }),
      {}
    )

    return taxonomy.related('posts').sync(posts)
  }
}
