import FrameworkVersion from '#models/framework_version'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class FrameworkVersionDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare createdAt: string
  declare updatedAt: string

  constructor(frameworkVersion?: FrameworkVersion) {
    super()

    if (!frameworkVersion) return
    this.id = frameworkVersion.id
    this.name = frameworkVersion.name
    this.slug = frameworkVersion.slug
    this.createdAt = frameworkVersion.createdAt?.toISO()!
    this.updatedAt = frameworkVersion.updatedAt?.toISO()!
  }
}
