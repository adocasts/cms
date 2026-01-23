import AssetDto from '#dtos/asset'
import CollectionTypes from '#enums/collection_types'
import RepositoryAccessLevels from '#enums/repository_access_levels'
import States from '#enums/states'
import Status from '#enums/status'
import Collection from '#models/collection'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class CollectionFormDto extends BaseModelDto {
  declare id: number
  declare ownerId: number
  declare parentId: number | null
  declare outdatedVersionId: number | null
  declare collectionTypeId: CollectionTypes
  declare statusId: Status
  declare stateId: States
  declare difficultyId: number | null
  declare assetId: number | null
  declare name: string
  declare slug: string
  declare description: string
  declare pageTitle: string
  declare metaDescription: string
  declare youtubePlaylistUrl: string | null
  declare repositoryUrl: string | null
  declare repositoryAccessLevel: RepositoryAccessLevels
  declare sortOrder: number
  declare createdAt: string
  declare updatedAt: string

  declare asset: AssetDto | null
  declare taxonomyIds: number[]
  declare frameworkVersionIds: number[]

  constructor(collection?: Collection) {
    super()

    if (!collection) return
    this.id = collection.id
    this.ownerId = collection.ownerId
    this.parentId = collection.parentId
    this.outdatedVersionId = collection.outdatedVersionId
    this.collectionTypeId = collection.collectionTypeId
    this.statusId = collection.statusId
    this.stateId = collection.stateId
    this.difficultyId = collection.difficultyId
    this.assetId = collection.assetId
    this.name = collection.name
    this.slug = collection.slug
    this.description = collection.description
    this.pageTitle = collection.pageTitle
    this.metaDescription = collection.metaDescription
    this.youtubePlaylistUrl = collection.youtubePlaylistUrl
    this.repositoryUrl = collection.repositoryUrl
    this.repositoryAccessLevel = collection.repositoryAccessLevel
    this.sortOrder = collection.sortOrder
    this.createdAt = collection.createdAt.toISO()!
    this.updatedAt = collection.updatedAt.toISO()!

    this.asset = collection.asset ? new AssetDto(collection.asset) : null
    this.taxonomyIds = collection.taxonomies?.map((row) => row.id) ?? []
    this.frameworkVersionIds = collection.frameworkVersions?.map((row) => row.id) ?? []
  }
}
