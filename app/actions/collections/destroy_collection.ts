import Collection from '#models/collection'
import History from '#models/history'
import db from '@adonisjs/lucid/services/db'

export default class DestroyCollection {
  static async byId(id: number) {
    const collection = await Collection.findOrFail(id)
    await this.#destroy(collection)
    return collection
  }

  static async #destroy(collection: Collection) {
    const children = await collection.related('children').query().select('id')
    const cascadeIds = [...children.map((child) => child.id), collection.id]

    await db.transaction(async (trx) => {
      collection.useTransaction(trx)

      await trx.from('collection_posts').whereIn('collection_id', cascadeIds).delete()

      await trx.from('collection_taxonomies').whereIn('collection_id', cascadeIds).delete()

      await History.query({ client: trx }).whereIn('collectionId', cascadeIds).delete()

      await collection.related('children').query().delete()

      await collection.delete()
    })
  }
}
