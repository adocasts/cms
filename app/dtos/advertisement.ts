import { BaseModelDto } from '@adocasts.com/dto/base'
import Advertisement from '#models/advertisement'
import UserDto from '#dtos/user'
import AdvertisementSizeDto from '#dtos/advertisement_size'
import AssetDto from '#dtos/asset'
import AdvertisementEventDto from '#dtos/advertisement_event'

export default class AdvertisementDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare assetId: number
  declare sizeId: number
  declare stateId: number
  declare url: string
  declare startAt: string
  declare endAt: string
  declare createdAt: string
  declare updatedAt: string
  declare isActive: boolean
  declare rangeDays?: number
  declare user: UserDto | null
  declare size: AdvertisementSizeDto | null
  declare asset: AssetDto | null
  declare impressions: AdvertisementEventDto[]
  declare clicks: AdvertisementEventDto[]

  constructor(advertisement?: Advertisement) {
    super()

    if (!advertisement) return
    this.id = advertisement.id
    this.userId = advertisement.userId
    this.assetId = advertisement.assetId
    this.sizeId = advertisement.sizeId
    this.stateId = advertisement.stateId
    this.url = advertisement.url
    this.startAt = advertisement.startAt.toISO()!
    this.endAt = advertisement.endAt.toISO()!
    this.createdAt = advertisement.createdAt.toISO()!
    this.updatedAt = advertisement.updatedAt.toISO()!
    this.isActive = advertisement.isActive
    this.rangeDays = advertisement.rangeDays
    this.user = advertisement.user && new UserDto(advertisement.user)
    this.size = advertisement.size && new AdvertisementSizeDto(advertisement.size)
    this.asset = advertisement.asset && new AssetDto(advertisement.asset)
    this.impressions = AdvertisementEventDto.fromArray(advertisement.impressions)
    this.clicks = AdvertisementEventDto.fromArray(advertisement.clicks)
  }
}
