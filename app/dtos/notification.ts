import { BaseModelDto } from '@adocasts.com/dto/base'
import Notification from '#models/notification'
import UserDto from '#dtos/user'

export default class NotificationDto extends BaseModelDto {
  declare id: number
  declare global: boolean
  declare userId: number
  declare initiatorUserId: number | null
  declare notificationTypeId: number
  declare table: string | null
  declare tableId: number | null
  declare title: string
  declare body: string
  declare href: string | null
  declare readAt: string | null
  declare actionedAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare settingsField: string
  declare settingsDescriptor: string
  declare isEmailEnabled: boolean

  constructor(notification?: Notification) {
    super()

    if (!notification) return
    this.id = notification.id
    this.global = notification.global
    this.userId = notification.userId
    this.initiatorUserId = notification.initiatorUserId
    this.notificationTypeId = notification.notificationTypeId
    this.table = notification.table
    this.tableId = notification.tableId
    this.title = notification.title
    this.body = notification.body
    this.href = notification.href
    this.readAt = notification.readAt?.toISO()!
    this.actionedAt = notification.actionedAt?.toISO()!
    this.createdAt = notification.createdAt.toISO()!
    this.updatedAt = notification.updatedAt.toISO()!
    this.user = notification.user && new UserDto(notification.user)
    this.settingsField = notification.settingsField
    this.settingsDescriptor = notification.settingsDescriptor
    this.isEmailEnabled = notification.isEmailEnabled(notification.user.profile)
  }
}
