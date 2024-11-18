import { BaseModelDto } from '@adocasts.com/dto/base'
import SessionLog from '#models/session_log'
import UserDto from '#dtos/user'
import type { UAParser } from 'ua-parser-js'

export default class SessionLogDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare token: string
  declare ipAddress: string | null
  declare userAgent: string | null
  declare browserName: string | null
  declare browserEngine: string | null
  declare browserVersion: string | null
  declare deviceModel: string | null
  declare deviceType: string | null
  declare deviceVendor: string | null
  declare osName: string | null
  declare osVersion: string | null
  declare city: string | null
  declare country: string | null
  declare countryCode: string | null
  declare lastTouchedAt: string | null
  declare loginAt: string | null
  declare loginSuccessful: boolean
  declare logoutAt: string | null
  declare forceLogout: boolean
  declare isRememberSession: boolean
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  isCurrentSession: boolean = false
  declare lastTouchedAgo: string | null
  declare device: UAParser.IResult | undefined
  declare browser: string
  declare location: string

  constructor(sessionLog?: SessionLog) {
    super()

    if (!sessionLog) return
    this.id = sessionLog.id
    this.userId = sessionLog.userId
    this.token = sessionLog.token
    this.ipAddress = sessionLog.ipAddress
    this.userAgent = sessionLog.userAgent
    this.browserName = sessionLog.browserName
    this.browserEngine = sessionLog.browserEngine
    this.browserVersion = sessionLog.browserVersion
    this.deviceModel = sessionLog.deviceModel
    this.deviceType = sessionLog.deviceType
    this.deviceVendor = sessionLog.deviceVendor
    this.osName = sessionLog.osName
    this.osVersion = sessionLog.osVersion
    this.city = sessionLog.city
    this.country = sessionLog.country
    this.countryCode = sessionLog.countryCode
    this.lastTouchedAt = sessionLog.lastTouchedAt?.toISO()!
    this.loginAt = sessionLog.loginAt?.toISO()!
    this.loginSuccessful = sessionLog.loginSuccessful
    this.logoutAt = sessionLog.logoutAt?.toISO()!
    this.forceLogout = sessionLog.forceLogout
    this.isRememberSession = sessionLog.isRememberSession
    this.createdAt = sessionLog.createdAt.toISO()!
    this.updatedAt = sessionLog.updatedAt.toISO()!
    this.user = sessionLog.user && new UserDto(sessionLog.user)
    this.isCurrentSession = sessionLog.isCurrentSession
    this.lastTouchedAgo = sessionLog.lastTouchedAgo
    this.device = sessionLog.device
    this.browser = sessionLog.browser
    this.location = sessionLog.location
  }
}
