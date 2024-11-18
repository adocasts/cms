import { BaseModelDto } from '@adocasts.com/dto/base'
import Post from '#models/post'
import AssetDto from '#dtos/asset'
import PostSnapshotDto from '#dtos/post_snapshot'
import CommentDto from '#dtos/comment'
import UserDto from '#dtos/user'
import TaxonomyDto from '#dtos/taxonomy'
import CollectionDto from '#dtos/collection'
import HistoryDto from '#dtos/history'
import ProgressDto from '#dtos/progress'
import WatchlistDto from '#dtos/watchlist'

export default class PostDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare assets: AssetDto[]
  declare thumbnails: AssetDto[]
  declare covers: AssetDto[]
  declare snapshots: PostSnapshotDto[]
  declare comments: CommentDto[]
  declare authors: UserDto[]
  declare taxonomies: TaxonomyDto[]
  declare series: CollectionDto[]
  declare rootSeries: CollectionDto[]
  declare rootPaths: CollectionDto[]
  declare courses: CollectionDto[]
  declare playlists: CollectionDto[]
  declare paths: CollectionDto[]
  declare collections: CollectionDto[]
  declare viewHistory: HistoryDto[]
  declare progressionHistory: ProgressDto[]
  declare watchlist: WatchlistDto[]
  declare publishAtISO: string
  declare publishAtDisplay: string

  constructor(post?: Post) {
    super()

    if (!post) return
    this.id = post.id
    this.title = post.title
    this.assets = AssetDto.fromArray(post.assets)
    this.thumbnails = AssetDto.fromArray(post.thumbnails)
    this.covers = AssetDto.fromArray(post.covers)
    this.snapshots = PostSnapshotDto.fromArray(post.snapshots)
    this.comments = CommentDto.fromArray(post.comments)
    this.authors = UserDto.fromArray(post.authors)
    this.taxonomies = TaxonomyDto.fromArray(post.taxonomies)
    this.series = CollectionDto.fromArray(post.series)
    this.rootSeries = CollectionDto.fromArray(post.rootSeries)
    this.rootPaths = CollectionDto.fromArray(post.rootPaths)
    this.courses = CollectionDto.fromArray(post.courses)
    this.playlists = CollectionDto.fromArray(post.playlists)
    this.paths = CollectionDto.fromArray(post.paths)
    this.collections = CollectionDto.fromArray(post.collections)
    this.viewHistory = HistoryDto.fromArray(post.viewHistory)
    this.progressionHistory = ProgressDto.fromArray(post.progressionHistory)
    this.watchlist = WatchlistDto.fromArray(post.watchlist)
  }
}
