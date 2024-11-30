import AssetTypes from '#enums/asset_types'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import Asset from '#models/asset'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'

interface AssetTypeDetails {
  id: AssetTypes
  fieldName: string
  extnames?: string[]
  size?: string | number
}

@inject()
export default class StoreAsset {
  declare uid: number
  declare type: AssetTypeDetails
  declare file: MultipartFile | null

  constructor(protected ctx: HttpContext) {}

  async handle() {
    const uid = this.ctx.auth.user?.id

    if (!uid) throw new UnauthorizedException('You must be logged in to upload assets')

    this.uid = uid!
    this.type = this.#getTypeDetails(this.ctx.params.typeId)
    this.file = this.#validate()

    if (!this.file) {
      throw new Exception(`${this.type.fieldName} is missing from the request`, {
        code: 'E_BAD_REQUEST',
        status: 400,
      })
    }

    const filename = await this.#moveToDisk()
    const asset = await this.#store(filename)

    return {
      id: asset.id,
      filename,
    }
  }

  #validate() {
    return this.ctx.request.file(this.type.fieldName, {
      size: this.type.size,
      extnames: this.type.extnames,
    })
  }

  async #moveToDisk() {
    const filename = `${this.uid}/${cuid()}.${this.file!.extname}`

    await this.file!.moveToDisk(filename)

    return filename
  }

  async #store(filename: string) {
    return Asset.create({
      assetTypeId: this.type.id,
      byteSize: this.file?.size,
      filename,
    })
  }

  #getTypeDetails(typeId: number | null): AssetTypeDetails {
    switch (typeId) {
      case AssetTypes.ADVERTISEMENT:
        return {
          id: AssetTypes.ADVERTISEMENT,
          fieldName: 'asset',
          size: '5mb',
          extnames: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'],
        }
      case AssetTypes.COVER:
        return {
          id: AssetTypes.COVER,
          fieldName: 'cover',
          size: '5mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        }
      case AssetTypes.CONTENT:
        return {
          id: AssetTypes.CONTENT,
          fieldName: 'content',
          size: '5mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        }
      default:
        return {
          id: AssetTypes.THUMBNAIL,
          fieldName: 'thumbnail',
          size: '5mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        }
    }
  }
}
