import { BaseModelDto } from '@adocasts.com/dto/base'
import EmailHistory from '#models/email_history'
import UserDto from '#dtos/user'

export default class EmailHistoryDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare emailFrom: string
  declare emailTo: string
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(emailHistory?: EmailHistory) {
    super()

    if (!emailHistory) return
    this.id = emailHistory.id
    this.userId = emailHistory.userId
    this.emailFrom = emailHistory.emailFrom
    this.emailTo = emailHistory.emailTo
    this.createdAt = emailHistory.createdAt.toISO()!
    this.updatedAt = emailHistory.updatedAt.toISO()!
    this.user = emailHistory.user && new UserDto(emailHistory.user)
  }
}