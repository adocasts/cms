import Post from '#models/post'
import { postSearchValidator } from '#validators/post'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof postSearchValidator>

export default class SearchPosts {
  static async handle({ term, ignoreIds = [], limit = 10 }: Params) {
    return Post.query()
      .whereNotIn('id', ignoreIds)
      .where((query) => {
        query.whereILike('title', `%${term}%`).orWhereILike('slug', `%${term}%`)
      })
      .orderBy('publishAt', 'desc')
      .limit(limit)
  }
}
