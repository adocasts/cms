import { BaseModelDto } from '@adocasts.com/dto/base'
import Asset from '#models/asset'
import PostDto from '#dtos/post'
import CollectionDto from '#dtos/collection'
import TaxonomyDto from '#dtos/taxonomy'

export default class AssetDto extends BaseModelDto {
  declare id: number
  declare assetTypeId: number
  declare filename: string
  declare byteSize: number | null
  declare altText: string | null
  declare credit: string | null
  declare createdAt: string
  declare updatedAt: string
  declare assetUrl: string
  declare posts: PostDto[]
  declare collections: CollectionDto[]
  declare taxonomies: TaxonomyDto[]

  constructor(asset?: Asset) {
    super()

    if (!asset) return
    this.id = asset.id
    this.assetTypeId = asset.assetTypeId
    this.filename = asset.filename
    this.byteSize = asset.byteSize
    this.altText = asset.altText
    this.credit = asset.credit
    this.createdAt = asset.createdAt.toISO()!
    this.updatedAt = asset.updatedAt.toISO()!
    this.assetUrl = asset.assetUrl
    this.posts = PostDto.fromArray(asset.posts)
    this.collections = CollectionDto.fromArray(asset.collections)
    this.taxonomies = TaxonomyDto.fromArray(asset.taxonomies)
  }
}