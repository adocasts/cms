import { BaseModelDto } from '@adocasts.com/dto/base'
import Taxonomy from '#models/taxonomy'
import UserDto from '#dtos/user'
import AssetDto from '#dtos/asset'
import HistoryDto from '#dtos/history'
import PostDto from '#dtos/post'
import CollectionDto from '#dtos/collection'
import TaxonomyTypes from '#enums/taxonomy_types'

export default class TaxonomyDto extends BaseModelDto {
  declare id: number
  declare ownerId: number
  declare rootParentId: number | null
  declare parentId: number | null
  declare levelIndex: number
  declare taxonomyTypeId: TaxonomyTypes
  declare assetId: number | null
  declare name: string
  declare slug: string
  declare description: string
  declare pageTitle: string
  declare metaDescription: string
  declare createdAt: string
  declare updatedAt: string
  declare owner: UserDto | null
  declare asset: AssetDto | null
  declare parent: TaxonomyDto | null
  declare children: TaxonomyDto[]
  declare viewHistory: HistoryDto[]
  declare progressionHistory: HistoryDto[]
  declare posts: PostDto[]
  declare collections: CollectionDto[]

  declare meta: Record<string, any>

  constructor(taxonomy?: Taxonomy) {
    super()

    if (!taxonomy) return
    this.id = taxonomy.id
    this.ownerId = taxonomy.ownerId
    this.rootParentId = taxonomy.rootParentId
    this.parentId = taxonomy.parentId
    this.levelIndex = taxonomy.levelIndex
    this.taxonomyTypeId = taxonomy.taxonomyTypeId
    this.assetId = taxonomy.assetId
    this.name = taxonomy.name
    this.slug = taxonomy.slug
    this.description = taxonomy.description
    this.pageTitle = taxonomy.pageTitle
    this.metaDescription = taxonomy.metaDescription
    this.createdAt = taxonomy.createdAt.toISO()!
    this.updatedAt = taxonomy.updatedAt.toISO()!
    this.owner = taxonomy.owner && new UserDto(taxonomy.owner)
    this.asset = taxonomy.asset && new AssetDto(taxonomy.asset)
    this.parent = taxonomy.parent && new TaxonomyDto(taxonomy.parent)
    this.children = TaxonomyDto.fromArray(taxonomy.children)
    this.viewHistory = HistoryDto.fromArray(taxonomy.viewHistory)
    this.progressionHistory = HistoryDto.fromArray(taxonomy.progressionHistory)
    this.posts = PostDto.fromArray(taxonomy.posts)
    this.collections = CollectionDto.fromArray(taxonomy.collections)

    this.meta = taxonomy.$extras
  }
}
