import Post from '#models/post'
import { postIndexValidator } from '#validators/post'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof postIndexValidator>

export default class GetPaginatedPosts {
  static async handle({ page = 1, perPage = 100, postTypeId, term }: Params = {} as Params) {
    return Post.query()
      .if(postTypeId, (query) => query.where('postTypeId', postTypeId!))
      .if(term, (query) => query.whereILike('title', `%${term!}%`))
      .preload('authors')
      .orderBy('publishAt', 'desc')
      .paginate(page, perPage)
  }
}
