import PostTypes from '#enums/post_types'
import States from '#enums/states'
import Asset from '#models/asset'
import Post from '#models/post'
import User from '#models/user'
import { postValidator } from '#validators/post'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Data = Infer<typeof postValidator>

type Params = {
  data: Data
  author: User
}

export default class StorePost {
  static async handle({ data, author }: Params) {
    if (!data.stateId) data.stateId = States.DRAFT
    if (!data.postTypeId) data.postTypeId = PostTypes.LESSON

    const { thumbnail, publishAtDate, publishAtTime, taxonomyIds, ...store } = data

    return db.transaction(async (trx) => {
      const publishAt = this.#getPublishAt(data)
      const post = await Post.create({ ...store, publishAt }, { client: trx })

      await post.related('authors').attach([author.id])
      await this.#syncTaxonomies(post, data.taxonomyIds)
      await this.#syncThumbnail(post, data.thumbnail, trx)

      return post
    })
  }

  static #getPublishAt({ timezone, publishAtDate, publishAtTime }: Data) {
    let publishAt = DateTime.now().setZone(timezone)

    if (publishAtDate) {
      const { year, month, day } = DateTime.fromJSDate(publishAtDate)
      publishAt = publishAt.set({ year, month, day })
    }

    if (publishAtTime) {
      const { hour, minute } = DateTime.fromJSDate(publishAtTime)
      publishAt = publishAt.set({ hour, minute })
    }

    return publishAt.setZone('UTC').set({ second: 0, millisecond: 0 })
  }

  static async #syncTaxonomies(post: Post, taxonomyIds: number[] = []) {
    const taxonomyData = taxonomyIds.reduce(
      (prev, currentId, i) => ({
        ...prev,
        [currentId]: {
          sort_order: i,
        },
      }),
      {}
    )

    await post.related('taxonomies').sync(taxonomyData)
  }

  static async #syncThumbnail(
    post: Post,
    data?: Data['thumbnail'],
    trx?: TransactionClientContract
  ) {
    if (!data?.id) return

    const thumbnail = await Asset.query({ client: trx }).where({ id: data.id }).firstOrFail()

    thumbnail.altText = data.altText ?? ''
    thumbnail.credit = data.credit ?? ''

    await thumbnail.save()
    await thumbnail.related('posts').sync({ [post.id]: { sort_order: 0 } })

    return thumbnail
  }

  public static async syncAssetTypes(
    assetIds: number[] | undefined,
    altTexts: (string | undefined)[] | undefined,
    credits: (string | undefined)[] | undefined
  ) {
    if (!assetIds || !assetIds.filter(Boolean).length) return

    const promises = assetIds.map((id, i) => {
      const altText = altTexts && altTexts[i]
      const credit = credits && credits[i]
      return Asset.query().where({ id }).update({ altText, credit })
    })

    await Promise.all(promises)
  }
}
