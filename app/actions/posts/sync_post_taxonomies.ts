import Post from '#models/post'

type Params = {
  post: Post
  ids?: number[]
}

export default class SyncPostTaxonomies {
  static async handle({ post, ids = [] }: Params) {
    const taxonomies = ids.reduce(
      (prev, currentId, i) => ({
        ...prev,
        [currentId]: {
          sort_order: i,
        },
      }),
      {}
    )

    await post.related('taxonomies').sync(taxonomies)
  }
}
