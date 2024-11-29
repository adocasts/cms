import StoreAsset from '#actions/assets/store_asset'
import Asset from '#models/asset'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'

export default class AssetsController {
  @inject()
  async store({ response }: HttpContext, storeAsset: StoreAsset) {
    return response.status(200).json(await storeAsset.handle())
  }

  async show({ request, response, params }: HttpContext) {
    let key = params['*']?.join('/')

    if (!Array.isArray(key) || !key.length) {
      key = request.qs().load || request.qs().fetch
    }

    console.log({
      key,
      params: params['*'],
      qs: request.qs(),
    })

    if (!key) {
      throw new Exception('Asset key was not found', {
        code: 'E_BAD_REQUEST',
        status: 400,
      })
    }

    const info = await drive.use('fs').getMetaData(key)
    const stream = await drive.use('fs').getStream(key)

    response.header('Content-Type', info.contentType!)

    return response.stream(stream)
  }

  async destroy({ params, response }: HttpContext) {
    const asset = await Asset.findOrFail(params.id)
    await drive.use('fs').delete(asset.filename)
    return response.status(204)
  }
}
