import Asset from '#models/asset'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class DestroyAsset {
  declare id: number

  constructor(protected ctx: HttpContext) {
    this.id = this.ctx.params.id
  }

  async handle() {
    const asset = await Asset.findOrFail(this.id)

    await this.#detachRelationships(asset)
    await drive.use().delete(asset.filename)
  }

  async #detachRelationships(asset: Asset) {
    await db.transaction(async (trx) => {
      asset.useTransaction(trx)

      const collections = await asset.related('collections').query()
      const taxonomies = await asset.related('taxonomies').query()

      for (let collection of collections) {
        collection.assetId = null
        await collection.save()
      }

      for (let taxonomy of taxonomies) {
        taxonomy.assetId = null
        await taxonomy.save()
      }

      await asset.related('posts').detach()
      await asset.delete()
    })
  }
}
