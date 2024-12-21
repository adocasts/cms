import DestroyAsset from '#actions/assets/destroy_asset'
import GetAssetStream from '#actions/assets/get_asset_stream'
import StoreAsset from '#actions/assets/store_asset'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class AssetsController {
  @inject()
  async store({ response, bouncer }: HttpContext, storeAsset: StoreAsset) {
    await bouncer.with('AssetPolicy').authorize('store')
    return response.status(200).json(await storeAsset.handle())
  }

  @inject()
  async show(_: HttpContext, getAssetStream: GetAssetStream) {
    return getAssetStream.handle()
  }

  @inject()
  async destroy({ response, bouncer }: HttpContext, destroyAsset: DestroyAsset) {
    await bouncer.with('AssetPolicy').authorize('destroy')
    await destroyAsset.handle()
    return response.status(204)
  }
}
