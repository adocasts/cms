import Post from '#models/post'

export default class GetPost {
  static async byId(id: number) {
    return Post.query()
      .where({ id })
      .preload('thumbnails', (query) => query.orderBy('sort_order'))
      .preload('covers', (query) => query.orderBy('sort_order'))
      .preload('chapters', (query) => query.orderBy('sort_order'))
      .preload('captions', (query) => query.orderBy('sort_order'))
      .preload('taxonomies')
      .preload('frameworkVersions')

      .firstOrFail()
  }
}
