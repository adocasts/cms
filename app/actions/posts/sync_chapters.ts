import Post from '#models/post'
import { postValidator } from '#validators/post'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { Infer } from '@vinejs/vine/types'

type Params = {
  post: Post
  chapters: Infer<typeof postValidator>['chapters']
}

export default class SyncChapters {
  static async handle({ post, chapters }: Params, trx: TransactionClientContract) {
    if (!chapters?.length) {
      await post.related('chapters').query().delete()
      return
    }

    const promises = chapters.map(async (chapter, index) => {
      if (!chapter.id) {
        return post.related('chapters').create(chapter, { client: trx })
      }

      const row = await post.related('chapters').query().where('id', chapter.id).firstOrFail()

      row.useTransaction(trx)
      row.merge({
        sortOrder: index,
        ...chapter,
      })

      return row.save()
    })

    await Promise.all(promises)
  }
}
