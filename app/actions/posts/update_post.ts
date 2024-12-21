import PostTypes from '#enums/post_types'
import States from '#enums/states'
import Post from '#models/post'
import { postValidator } from '#validators/post'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'
import SyncPostAsset from './sync_post_assets.js'
import SyncTaxonomies from '#actions/taxonomies/sync_taxonomies'

type Data = Infer<typeof postValidator>

export default class UpdatePost {
  static async byId(id: number, data: Data) {
    const post = await Post.findOrFail(id)
    await this.#update(post, data)
    return post
  }

  static async handle(post: Post, data: Data) {
    await this.#update(post, data)
    return post
  }

  static async #update(post: Post, data: Data) {
    if (!data.stateId) data.stateId = States.DRAFT
    if (!data.postTypeId) data.postTypeId = PostTypes.LESSON

    const { thumbnail, publishAtDate, publishAtTime, taxonomyIds, ...update } = data

    post.merge(update)

    if (!data.videoBunnyId) post.videoBunnyId = null
    if (!data.videoUrl) post.videoUrl = null
    if (!data.videoBunnyId && !data.videoUrl) post.videoSeconds = 0

    return db.transaction(async (trx) => {
      post.useTransaction(trx)

      await post.save()
      await SyncTaxonomies.handle({ resource: post, ids: taxonomyIds })
      await SyncPostAsset.handle({ post, asset: thumbnail }, trx)

      return post
    })
  }
}
