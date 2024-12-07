import Post from '#models/post'
import { postIndexValidator } from '#validators/post'
import { Infer } from '@vinejs/vine/types'

type Params = {
  page?: number
  perPage?: number
  data?: Infer<typeof postIndexValidator>
}

export default class GetPaginatedPosts {
  static async handle({ page = 1, perPage = 100, data }: Params) {
    return Post.query()
      .if(data?.postTypeId, (query) => query.where('postTypeId', data!.postTypeId!))
      .if(data?.term, (query) => query.whereILike('title', `%${data!.term!}%`))
      .preload('authors')
      .orderBy('publishAt', 'desc')
      .paginate(page, perPage)
  }
}
