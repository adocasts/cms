import PostTypes from '#enums/post_types'
import States from '#enums/states'
import Post from '#models/post'
import User from '#models/user'
import { postValidator } from '#validators/post'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'
import SyncPostAsset from './sync_post_assets.js'
import SyncTaxonomies from '#actions/taxonomies/sync_taxonomies'
import SyncCaptions from './sync_captions.js'
import SyncChapters from './sync_chapters.js'

type Data = Infer<typeof postValidator>

type Params = {
  data: Data
  author: User
}

export default class StorePost {
  static async handle({ data, author }: Params) {
    if (!data.stateId) data.stateId = States.DRAFT
    if (!data.postTypeId) data.postTypeId = PostTypes.LESSON

    const { thumbnail, publishAtDate, publishAtTime, taxonomyIds, captions, chapters, ...store } =
      data

    return db.transaction(async (trx) => {
      const post = await Post.create(store, { client: trx })

      await post.related('authors').attach([author.id])

      await SyncTaxonomies.handle({ resource: post, ids: taxonomyIds })
      await SyncPostAsset.handle({ post, asset: thumbnail }, trx)
      await SyncCaptions.handle({ post, captions }, trx)
      await SyncChapters.handle({ post, chapters }, trx)

      return post
    })
  }
}
