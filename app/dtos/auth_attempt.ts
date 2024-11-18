import { BaseModelDto } from '@adocasts.com/dto/base'
import AuthAttempt from '#models/auth_attempt'

export default class AuthAttemptDto extends BaseModelDto {
  declare id: number
  declare uid: string
  declare purposeId: number
  declare deletedAt: string | null
  declare createdAt: string
  declare updatedAt: string

  constructor(authAttempt?: AuthAttempt) {
    super()

    if (!authAttempt) return
    this.id = authAttempt.id
    this.uid = authAttempt.uid
    this.purposeId = authAttempt.purposeId
    this.deletedAt = authAttempt.deletedAt?.toISO()!
    this.createdAt = authAttempt.createdAt.toISO()!
    this.updatedAt = authAttempt.updatedAt.toISO()!
  }
}