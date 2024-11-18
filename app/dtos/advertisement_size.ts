import { BaseModelDto } from '@adocasts.com/dto/base'
import AdvertisementSize from '#models/advertisement_size'

export default class AdvertisementSizeDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare width: number
  declare height: number
  declare createdAt: string
  declare updatedAt: string
  declare aspectRatio: number

  constructor(advertisementSize?: AdvertisementSize) {
    super()

    if (!advertisementSize) return
    this.id = advertisementSize.id
    this.name = advertisementSize.name
    this.width = advertisementSize.width
    this.height = advertisementSize.height
    this.createdAt = advertisementSize.createdAt.toISO()!
    this.updatedAt = advertisementSize.updatedAt.toISO()!
    this.aspectRatio = advertisementSize.aspectRatio
  }
}
