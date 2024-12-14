import UpdateAsset from '#actions/assets/update_asset'
import SyncTaxonomies from '#actions/taxonomies/sync_taxonomies'
import CollectionTypes from '#enums/collection_types'
import States from '#enums/states'
import Status from '#enums/status'
import Collection from '#models/collection'
import { collectionValidator } from '#validators/collection'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  id: number
  data: Infer<typeof collectionValidator>
}

export default class UpdateCollection {
  static async handle({ id, data }: Params) {
    if (!data.stateId) data.stateId = States.PRIVATE
    if (!data.statusId) data.statusId = Status.COMING_SOON
    if (!data.collectionTypeId) data.collectionTypeId = CollectionTypes.SERIES

    const { taxonomyIds, postIds, subcollections, asset, ...update } = data
    const collection = await Collection.findOrFail(id)

    collection.merge(update)

    return db.transaction(async (trx) => {
      collection.useTransaction(trx)

      await collection.save()
      await SyncTaxonomies.handle({ resource: collection, ids: taxonomyIds })
      await UpdateAsset.handle(asset, trx)

      return collection
    })
  }
}
