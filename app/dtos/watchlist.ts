import { BaseModelDto } from '@adocasts.com/dto/base'
import Watchlist from '#models/watchlist'
import UserDto from '#dtos/user'
import PostDto from '#dtos/post'
import CollectionDto from '#dtos/collection'
import TaxonomyDto from '#dtos/taxonomy'

export default class WatchlistDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare postId: number | null
  declare collectionId: number | null
  declare taxonomyId: number | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare post: PostDto | null
  declare collection: CollectionDto | null
  declare taxonomy: TaxonomyDto | null

  constructor(watchlist?: Watchlist) {
    super()

    if (!watchlist) return
    this.id = watchlist.id
    this.userId = watchlist.userId
    this.postId = watchlist.postId
    this.collectionId = watchlist.collectionId
    this.taxonomyId = watchlist.taxonomyId
    this.createdAt = watchlist.createdAt.toISO()!
    this.updatedAt = watchlist.updatedAt.toISO()!
    this.user = watchlist.user && new UserDto(watchlist.user)
    this.post = watchlist.post && new PostDto(watchlist.post)
    this.collection = watchlist.collection && new CollectionDto(watchlist.collection)
    this.taxonomy = watchlist.taxonomy && new TaxonomyDto(watchlist.taxonomy)
  }
}