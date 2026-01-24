import AppBaseModel from '#models/app_base_model'
import Collection from '#models/collection'
import Post from '#models/post'
import { column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class FrameworkVersion extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare framework: string

  @column()
  declare version: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Post, {
    pivotTable: 'post_framework_versions',
    pivotTimestamps: true,
  })
  declare posts: ManyToMany<typeof Post>

  @manyToMany(() => Collection, {
    pivotTable: 'collection_framework_versions',
    pivotTimestamps: true,
  })
  declare collections: ManyToMany<typeof Collection>
}
