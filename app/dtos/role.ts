import { BaseModelDto } from '@adocasts.com/dto/base'
import Role from '#models/role'
import UserDto from '#dtos/user'

export default class RoleDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare description: string
  declare createdAt: string
  declare updatedAt: string
  declare users: UserDto[]

  declare meta: Record<string, any>

  constructor(role?: Role) {
    super()

    if (!role) return
    this.id = role.id
    this.name = role.name
    this.description = role.description
    this.createdAt = role.createdAt.toISO()!
    this.updatedAt = role.updatedAt.toISO()!
    this.users = UserDto.fromArray(role.users)

    this.meta = role.$extras
  }
}
