import { BaseModelDto } from '@adocasts.com/dto/base'
import RateLimit from '#models/rate_limit'

export default class RateLimitDto extends BaseModelDto {
  declare key: string
  declare points: number
  declare expire: string

  constructor(rateLimit?: RateLimit) {
    super()

    if (!rateLimit) return
    this.key = rateLimit.key
    this.points = rateLimit.points
    this.expire = rateLimit.expire.toISO()!
  }
}