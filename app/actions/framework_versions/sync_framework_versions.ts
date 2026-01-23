import NotImplementedException from '#exceptions/not_implemented_exception'
import Collection from '#models/collection'
import Post from '#models/post'

type Resource = Post | Collection

type Params = {
  resource: Resource
  ids?: number[]
}

export default class SyncFrameworkVersions {
  static async handle({ resource, ids = [] }: Params) {
    const frameworkVersions = ids.reduce(
      (prev, currentId) => ({
        ...prev,
        [currentId]: {},
      }),
      {}
    )

    switch (true) {
      case resource instanceof Post:
        await resource.related('frameworkVersions').sync(frameworkVersions)
        break
      case resource instanceof Collection:
        await resource.related('frameworkVersions').sync(frameworkVersions)
        break
      default:
        throw new NotImplementedException(
          `SyncFrameworkVersions has not yet implemented ${Object.getPrototypeOf(resource)}`
        )
    }
  }
}
