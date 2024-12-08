import Collection from '#models/collection'
import { collectionIndexValidator } from '#validators/collection'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof collectionIndexValidator>

export default class GetPaginatedCollections {
  static async handle({ page = 1, perPage = 100, collectionTypeId, term }: Params = {} as Params) {
    const collections = await Collection.query()
      .if(collectionTypeId, (query) => query.where({ collectionTypeId }))
      .if(term, (query) => query.whereILike('name', `%${term}%`))
      .preload('children', (query) => query.withCount('posts').select('id'))
      .withCount('posts', (query) => query.as('direct_posts_count'))
      .whereNull('parentId')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    return this.#sumTotalPosts(collections)
  }

  static async #sumTotalPosts(collections: ModelPaginatorContract<Collection>) {
    for (const collection of collections) {
      const directPostsCount = Number(collection.$extras.direct_posts_count)
      const subcollectionPostsCount = collection.children.reduce(
        (count, child) => count + Number(child.$extras.posts_count),
        0
      )

      collection.$extras.posts_count = directPostsCount + subcollectionPostsCount
    }

    return collections
  }
}
