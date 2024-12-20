import Collection from '#models/collection'

export default class GetCollectionContent {
  static async byId(id: number) {
    const collection = await Collection.findOrFail(id)
    const modules = await this.#getModuleContent(collection)
    const posts = await this.#getRootPosts(collection)

    return {
      collection,
      modules,
      posts,
    }
  }

  static async #getModuleContent(collection: Collection) {
    return collection
      .related('children')
      .query()
      .preload('posts', (q) => q.orderBy('pivot_sort_order'))
      .orderBy('sort_order')
  }

  static async #getRootPosts(collection: Collection) {
    return collection.related('posts').query().orderBy('pivot_sort_order')
  }
}
