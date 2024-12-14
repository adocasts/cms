import NotImplementedException from '#exceptions/not_implemented_exception'
import Collection from '#models/collection'
import Post from '#models/post'

type Resource = Post | Collection

type Params = {
  resource: Resource
  ids?: number[]
}

export default class SyncTaxonomies {
  static async handle({ resource, ids = [] }: Params) {
    const taxonomies = ids.reduce(
      (prev, currentId, i) => ({
        ...prev,
        [currentId]: {
          sort_order: i,
        },
      }),
      {}
    )

    switch (true) {
      case resource instanceof Post:
        await resource.related('taxonomies').sync(taxonomies)
        break
      case resource instanceof Collection:
        await resource.related('taxonomies').sync(taxonomies)
        break
      default:
        throw new NotImplementedException(
          `SyncTaxonomies has not yet implemented ${Object.getPrototypeOf(resource)}`
        )
    }
  }
}
