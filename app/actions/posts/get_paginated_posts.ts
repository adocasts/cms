import Post from '#models/post'

type Params = {
  page?: number
  perPage?: number
}

export default class GetPaginatedPosts {
  static async handle({ page = 1, perPage = 100 }: Params) {
    return Post.query().preload('authors').orderBy('publishAt', 'desc').paginate(page, perPage)
  }
}
