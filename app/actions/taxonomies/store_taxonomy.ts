import UpdateAsset from '#actions/assets/update_asset'
import Taxonomy from '#models/taxonomy'
import User from '#models/user'
import { taxonomyValidator } from '#validators/taxonomy'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof taxonomyValidator>
  user: User
}

export default class StoreTaxonomy {
  static async handle({ data, user }: Params) {
    const { asset, ...store } = data

    return db.transaction(async (trx) => {
      const taxonomy = await Taxonomy.create(
        {
          ...store,
          assetId: asset.id,
          ownerId: user.id,
        },
        { client: trx }
      )

      await UpdateAsset.handle(asset, trx)

      return taxonomy
    })
  }
}
