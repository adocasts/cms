import { BaseModelDto } from '@adocasts.com/dto/base'
import AdvertisementEvent from '#models/advertisement_event'
import AnalyticTypes from '#enums/analytic_types'
import AdvertisementDto from '#dtos/advertisement'

export default class AdvertisementEventDto extends BaseModelDto {
  declare id: number
  declare typeId: AnalyticTypes
  declare advertisementId: number
  declare identity: string
  declare category: string
  declare action: string
  declare path: string
  declare host: string
  declare browser: string
  declare browserVersion: string
  declare os: string
  declare createdAt: string
  declare updatedAt: string
  declare advertisement: AdvertisementDto | null

  constructor(advertisementEvent?: AdvertisementEvent) {
    super()

    if (!advertisementEvent) return
    this.id = advertisementEvent.id
    this.typeId = advertisementEvent.typeId
    this.advertisementId = advertisementEvent.advertisementId
    this.identity = advertisementEvent.identity
    this.category = advertisementEvent.category
    this.action = advertisementEvent.action
    this.path = advertisementEvent.path
    this.host = advertisementEvent.host
    this.browser = advertisementEvent.browser
    this.browserVersion = advertisementEvent.browserVersion
    this.os = advertisementEvent.os
    this.createdAt = advertisementEvent.createdAt.toISO()!
    this.updatedAt = advertisementEvent.updatedAt.toISO()!
    this.advertisement =
      advertisementEvent.advertisement && new AdvertisementDto(advertisementEvent.advertisement)
  }
}
