import UpdateAsset from '#actions/assets/update_asset'
import Taxonomy from '#models/taxonomy'
import { taxonomyValidator } from '#validators/taxonomy'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  id: number
  data: Infer<typeof taxonomyValidator>
}

export default class UpdateTaxonomy {
  static async handle({ id, data }: Params) {
    const { asset, ...update } = data
    const taxonomy = await Taxonomy.findOrFail(id)

    taxonomy.merge(update)

    return db.transaction(async (trx) => {
      taxonomy.useTransaction(trx)

      await taxonomy.save()
      await UpdateAsset.handle(asset, trx)

      return taxonomy
    })
  }
}
