import GetCollectionContent from '#actions/collections/get_collection_content'
import CollectionDto from '#dtos/collection'
import PostDto from '#dtos/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class CollectionContentsController {
  async edit({ params, inertia }: HttpContext) {
    const { collection, modules, posts } = await GetCollectionContent.byId(params.id)

    return inertia.render('collections/content', {
      collection: new CollectionDto(collection),
      modules: CollectionDto.fromArray(modules),
      posts: PostDto.fromArray(posts),
    })
  }

  async update({}: HttpContext) {}
}
