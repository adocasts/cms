import GetCollectionContent from '#actions/collections/get_collection_content'
import SyncCollectionContent from '#actions/collections/sync_collection_content'
import CollectionDto from '#dtos/collection'
import PostDto from '#dtos/post'
import { collectionContentValidator } from '#validators/collection'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class CollectionContentsController {
  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('update')

    const { collection, modules, posts } = await GetCollectionContent.byId(params.id)

    return inertia.render('collections/content', {
      collection: new CollectionDto(collection),
      modules: CollectionDto.fromArray(modules),
      posts: PostDto.fromArray(posts),
    })
  }

  @inject()
  async update(
    { params, request, response, auth, session, bouncer }: HttpContext,
    syncCollectionContent: SyncCollectionContent
  ) {
    await bouncer.with('CollectionPolicy').authorize('update')

    const data = await request.validateUsing(collectionContentValidator)

    await syncCollectionContent.handle({
      user: auth.user!,
      collectionId: params.id,
      data,
    })

    session.flash('success', 'Collection content updated successfully')

    return response.redirect().back()
  }
}
