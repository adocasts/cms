import Asset from '#models/asset'
import Post from '#models/post'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export type AssetContract = {
  id: number | undefined
  altText: string | undefined
  credit: string | undefined
}

type Params = {
  post: Post
  asset: AssetContract
  order?: number
}

export default class SyncPostAsset {
  static async handle({ post, asset, order = 0 }: Params, trx?: TransactionClientContract) {
    if (!asset?.id) return

    const record = await Asset.query({ client: trx }).where({ id: asset.id }).firstOrFail()

    record.altText = asset.altText ?? ''
    record.credit = asset.credit ?? ''

    await record.save()
    await record.related('posts').sync({ [post.id]: { sort_order: order } })

    return asset
  }
}
