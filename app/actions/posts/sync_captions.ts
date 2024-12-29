import Post from '#models/post'
import { postValidator } from '#validators/post'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { Infer } from '@vinejs/vine/types'

type Params = {
  post: Post
  captions: Infer<typeof postValidator>['captions']
}

export default class SyncCaptions {
  static async handle({ post, captions }: Params, trx: TransactionClientContract) {
    if (!captions?.length) {
      await post.related('captions').query().delete()
      return
    }

    const postCaptions = await post.related('captions').query().orderBy('sort_order')

    const promises = captions.map(async (caption, index) => {
      if (!caption.id) {
        return post.related('captions').create(caption, { client: trx })
      }

      const row = await post.related('captions').query().where('id', caption.id).firstOrFail()

      row.useTransaction(trx)
      row.merge({
        sortOrder: index,
        ...caption,
      })

      return row.save()
    })

    const deletedCaptionIds = postCaptions
      .filter(({ id }) => !captions.find((c) => c.id === id))
      .map(({ id }) => id)

    if (deletedCaptionIds.length) {
      await post.related('captions').query().whereIn('id', deletedCaptionIds).delete()
    }

    await Promise.all(promises)
  }
}
