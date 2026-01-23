import UpdateAsset from '#actions/assets/update_asset'
import SyncFrameworkVersions from '#actions/framework_versions/sync_framework_versions'
import SyncTaxonomies from '#actions/taxonomies/sync_taxonomies'
import CollectionTypes from '#enums/collection_types'
import States from '#enums/states'
import Status from '#enums/status'
import Collection from '#models/collection'
import User from '#models/user'
import { collectionValidator } from '#validators/collection'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof collectionValidator>
  user: User
}

export default class StoreCollection {
  static async handle({ data, user }: Params) {
    if (!data.stateId) data.stateId = States.PRIVATE
    if (!data.statusId) data.statusId = Status.COMING_SOON
    if (!data.collectionTypeId) data.collectionTypeId = CollectionTypes.SERIES

    const { taxonomyIds, frameworkVersionIds, asset, ...store } = data

    return db.transaction(async (trx) => {
      const collection = await Collection.create(
        {
          ...store,
          assetId: asset.id,
          ownerId: user.id,
        },
        { client: trx }
      )

      await SyncTaxonomies.handle({ resource: collection, ids: taxonomyIds })
      await SyncFrameworkVersions.handle({ resource: collection, ids: frameworkVersionIds })
      await UpdateAsset.handle(asset, trx)

      return collection
    })
  }
}
