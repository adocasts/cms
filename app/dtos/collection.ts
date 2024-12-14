import { BaseModelDto } from '@adocasts.com/dto/base'
import Collection from '#models/collection'
import CollectionTypes from '#enums/collection_types'
import Status from '#enums/status'
import State from '#enums/states'
import UserDto from '#dtos/user'
import AssetDto from '#dtos/asset'
import PostDto from '#dtos/post'
import TaxonomyDto from '#dtos/taxonomy'
import WatchlistDto from '#dtos/watchlist'
import HistoryDto from '#dtos/history'
import ProgressDto from '#dtos/progress'

export default class CollectionDto extends BaseModelDto {
  declare id: number
  declare ownerId: number
  declare parentId: number | null
  declare outdatedVersionId: number | null
  declare collectionTypeId: CollectionTypes
  declare statusId: Status
  declare stateId: State
  declare difficultyId: number | null
  declare assetId: number | null
  declare name: string
  declare slug: string
  declare description: string
  declare pageTitle: string
  declare metaDescription: string
  declare youtubePlaylistUrl: string
  declare repositoryUrl: string
  declare sortOrder: number
  declare moduleNumber: number
  declare owner: UserDto | null
  declare asset: AssetDto | null
  declare parent: CollectionDto | null
  declare outdatedVersion: CollectionDto | null
  declare updatedVersions: CollectionDto[]
  declare posts: PostDto[]
  declare postsFlattened: PostDto[]
  declare taxonomies: TaxonomyDto[]
  declare children: CollectionDto[]
  declare watchlist: WatchlistDto[]
  declare viewHistory: HistoryDto[]
  declare progressionHistory: ProgressDto[]
  declare meta: Record<string, any>

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
    this.moduleNumber = collection.moduleNumber
    this.owner = collection.owner && new UserDto(collection.owner)
    this.asset = collection.asset && new AssetDto(collection.asset)
    this.parent = collection.parent && new CollectionDto(collection.parent)
    this.outdatedVersion =
      collection.outdatedVersion && new CollectionDto(collection.outdatedVersion)
    this.updatedVersions = CollectionDto.fromArray(collection.updatedVersions)
    this.posts = PostDto.fromArray(collection.posts)
    this.postsFlattened = PostDto.fromArray(collection.postsFlattened)
    this.taxonomies = TaxonomyDto.fromArray(collection.taxonomies)
    this.children = CollectionDto.fromArray(collection.children)
    this.watchlist = WatchlistDto.fromArray(collection.watchlist)
    this.viewHistory = HistoryDto.fromArray(collection.viewHistory)
    this.progressionHistory = ProgressDto.fromArray(collection.progressionHistory)
    this.meta = collection.$extras
  }
}
