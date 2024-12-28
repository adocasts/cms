import Asset from '#models/asset'
import Post from '#models/post'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class DestroyPost {
  static async byId(id: number) {
    const post = await Post.findOrFail(id)
    await this.#destroy(post)
    return post
  }

  static async handle(post: Post) {
    await this.#destroy(post)
    return post
  }

  static async #destroy(post: Post) {
    const deletable = await db.transaction(async (trx) => {
      post.useTransaction(trx)

      await post.related('authors').detach()
      await post.related('collections').detach()
      await post.related('taxonomies').detach()

      await post.related('chapters').query().delete()
      await post.related('captions').query().delete()

      await this.#destroyComments(post, trx)
      await this.#destroyHistory(post)
      await this.#removeFromWatchlists(post)

      const deletableAssets = await this.#destroyAssets(post, trx)

      await post.delete()

      return { assets: deletableAssets }
    })

    await this.#destroyAssetFiles(deletable.assets)
  }

  static async #removeFromWatchlists(post: Post) {
    await post.related('watchlist').query().delete()
  }

  static async #destroyComments(post: Post, trx: TransactionClientContract) {
    const comments = await post.related('comments').query().select('id')
    const commentIds = comments.map((comment) => comment.id)

    await trx.from('comment_votes').whereIn('comment_id', commentIds)
    await post.related('comments').query().delete()
  }

  static async #destroyHistory(post: Post) {
    await post.related('viewHistory').query().delete()
    await post.related('progressionHistory').query().delete()
  }

  static async #destroyAssets(post: Post, trx: TransactionClientContract) {
    const assets = await post.related('assets').query().select(['id', 'filename'])
    const assetIds = assets.map((a) => a.id)
    const unusedQuery = Asset.query({ client: trx })
      .whereIn('id', assetIds)
      .whereDoesntHave('collections', (query) => query)
      .whereDoesntHave('posts', (query) => query)
      .whereDoesntHave('taxonomies', (query) => query)

    // grab a reference of the unused assets we can delete from the drive
    // wait to delete until transaction has committed
    const unused = await unusedQuery.clone()

    await post.related('assets').detach()
    await unusedQuery.delete()

    return unused
  }

  static async #destroyAssetFiles(assets: Asset[]) {
    for (let asset of assets) {
      await drive.use().delete(asset.filename)
    }
  }
}
