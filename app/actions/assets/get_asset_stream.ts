import BadRequestException from '#exceptions/bad_request_exception'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'

@inject()
export default class GetAssetStream {
  constructor(protected ctx: HttpContext) {}

  async handle() {
    let key = this.ctx.params['*'] && this.ctx.params['*'].join('/')

    if (!key && !key.length) {
      key = this.ctx.request.qs().load
    }

    console.log({
      key,
      params: this.ctx.params['*'],
    })

    if (!key) {
      throw new BadRequestException('Asset key was not found')
    }

    const info = await drive.use().getMetaData(key)
    const stream = await drive.use().getStream(key)

    this.ctx.response.header('Content-Type', info.contentType!)

    return this.ctx.response.stream(stream)
  }
}
