import UpdateAsset from '#actions/assets/update_asset'
import Taxonomy from '#models/taxonomy'
import { taxonomyValidator } from '#validators/taxonomy'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Data = Infer<typeof taxonomyValidator>

export default class UpdateTaxonomy {
  static async byId(id: number, data: Data) {
    const taxonomy = await Taxonomy.findOrFail(id)
    return this.#update(taxonomy, data)
  }

  static async handle(taxonomy: Taxonomy, data: Data) {
    return this.#update(taxonomy, data)
  }

  static async #update(taxonomy: Taxonomy, data: Data) {
    const { asset, ...update } = data

    taxonomy.merge(update)

    return db.transaction(async (trx) => {
      taxonomy.useTransaction(trx)

      await taxonomy.save()
      await UpdateAsset.handle(asset, trx)

      return taxonomy
    })
  }
}
