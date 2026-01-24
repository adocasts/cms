import FrameworkVersion from '#models/framework_version'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class FrameworkVersionDto extends BaseModelDto {
  declare id: number
  declare framework: string
  declare version: string
  declare slug: string
  declare createdAt: string
  declare updatedAt: string
  declare name: string

  constructor(frameworkVersion?: FrameworkVersion) {
    super()

    if (!frameworkVersion) return
    this.id = frameworkVersion.id
    this.framework = frameworkVersion.framework
    this.version = frameworkVersion.version
    this.slug = frameworkVersion.slug
    this.createdAt = frameworkVersion.createdAt?.toISO()!
    this.updatedAt = frameworkVersion.updatedAt?.toISO()!

    this.name = `${frameworkVersion.framework} ${frameworkVersion.version}`
  }
}
