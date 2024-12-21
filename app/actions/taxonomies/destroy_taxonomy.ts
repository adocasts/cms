import History from '#models/history'
import Taxonomy from '#models/taxonomy'
import db from '@adonisjs/lucid/services/db'

export default class DestroyTaxonomy {
  static async byId(id: number) {
    const taxonomy = await Taxonomy.findOrFail(id)
    await this.#destroy(taxonomy)
    return taxonomy
  }

  static async handle(taxonomy: Taxonomy) {
    await this.#destroy(taxonomy)
    return taxonomy
  }

  static async #destroy(taxonomy: Taxonomy) {
    const children = await taxonomy.related('rootChildren').query().select('id')
    const cascadeIds = [...children.map((child) => child.id), taxonomy.id]

    await db.transaction(async (trx) => {
      taxonomy.useTransaction(trx)

      await trx.from('post_taxonomies').whereIn('taxonomy_id', cascadeIds).delete()

      await trx.from('collection_taxonomies').whereIn('taxonomy_id', cascadeIds).delete()

      await History.query({ client: trx }).whereIn('taxonomyId', cascadeIds).delete()

      await taxonomy.related('rootChildren').query().delete()

      await taxonomy.delete()
    })
  }
}
