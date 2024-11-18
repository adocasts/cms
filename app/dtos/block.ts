import { BaseModelDto } from '@adocasts.com/dto/base'
import Block from '#models/block'
import UserDto from '#dtos/user'

export default class BlockDto extends BaseModelDto {
  declare id: number
  declare userId: number | null
  declare sectionId: number
  declare ipAddress: string
  declare reason: string | null
  declare expiresAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(block?: Block) {
    super()

    if (!block) return
    this.id = block.id
    this.userId = block.userId
    this.sectionId = block.sectionId
    this.ipAddress = block.ipAddress
    this.reason = block.reason
    this.expiresAt = block.expiresAt?.toISO()!
    this.createdAt = block.createdAt.toISO()!
    this.updatedAt = block.updatedAt.toISO()!
    this.user = block.user && new UserDto(block.user)
  }
}