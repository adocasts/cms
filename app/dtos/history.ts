import { BaseModelDto } from '@adocasts.com/dto/base'
import History from '#models/history'
import HistoryTypes from '#enums/history_types'
import PostDto from '#dtos/post'
import CollectionDto from '#dtos/collection'
import TaxonomyDto from '#dtos/taxonomy'

export default class HistoryDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare postId: number | null
  declare collectionId: number | null
  declare taxonomyId: number | null
  declare historyTypeId: HistoryTypes
  declare route: string
  declare createdAt: string
  declare updatedAt: string
  declare post: PostDto | null
  declare collection: CollectionDto | null
  declare taxonomy: TaxonomyDto | null

  constructor(history?: History) {
    super()

    if (!history) return
    this.id = history.id
    this.userId = history.userId
    this.postId = history.postId
    this.collectionId = history.collectionId
    this.taxonomyId = history.taxonomyId
    this.historyTypeId = history.historyTypeId
    this.route = history.route
    this.createdAt = history.createdAt.toISO()!
    this.updatedAt = history.updatedAt.toISO()!
    this.post = history.post && new PostDto(history.post)
    this.collection = history.collection && new CollectionDto(history.collection)
    this.taxonomy = history.taxonomy && new TaxonomyDto(history.taxonomy)
  }
}