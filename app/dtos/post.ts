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
import VideoTypes from '#enums/video_types'
import States from '#enums/states'
import PaywallTypes from '#enums/paywall_types'
import PostTypes from '#enums/post_types'
import PostChapterDto from './post_chapter.js'
import PostCaptionDto from './post_caption.js'

export default class PostDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare slug: string
  declare pageTitle: string | null
  declare description: string | null
  declare metaDescription: string | null
  declare canonical: string | null
  declare body: string | null
  declare bodyBlocks: object | string | null
  declare bodyTypeId: number
  declare videoTypeId: VideoTypes | null
  declare videoUrl: string | null
  declare videoBunnyId: string | null
  declare livestreamUrl: string | null
  declare isFeatured: boolean | null
  declare isPersonal: boolean | null
  declare isLive: boolean | null
  declare viewCount: number | null
  declare viewCountUnique: number | null
  declare stateId: States
  declare paywallTypeId: PaywallTypes
  declare readMinutes: number
  declare readTime: number
  declare wordCount: number
  declare videoSeconds: number
  declare postTypeId: PostTypes
  declare redirectUrl: string
  declare repositoryUrl: string
  declare isWatchlistSent: boolean
  declare timezone: string | null
  declare publishAtUser: string | null
  declare publishAt?: string | null
  declare publishAtDate?: string | null
  declare publishAtTime?: string | null
  declare createdAt: string
  declare updatedAt: string

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
  declare chapters: PostChapterDto[]
  declare captions: PostCaptionDto[]

  declare publishAtISO: string | null
  declare publishAtDisplay: string
  declare rootSortOrder: number
  declare videoYouTubeId: string
  declare videoId: string | null
  declare bunnyHlsUrl?: string
  declare bunnyFallbackUrls: { height: string; src: string }[] | undefined
  declare bunnySubtitleUrls: { src: string; label: string; code: string }[] | undefined
  declare transcriptUrl?: string
  declare animatedPreviewUrl?: string
  declare streamId: string
  declare hasVideo: string | null
  declare watchMinutes: string | 0
  declare readMinutesDisplay: string | 0
  declare routeUrl: string

  declare meta: Record<string, any>

  constructor(post?: Post) {
    super()

    if (!post) return
    this.id = post.id
    this.title = post.title
    this.slug = post.slug
    this.pageTitle = post.pageTitle
    this.description = post.description
    this.metaDescription = post.metaDescription
    this.canonical = post.canonical
    this.body = post.body
    this.bodyBlocks = post.bodyBlocks
    this.bodyTypeId = post.bodyTypeId
    this.videoTypeId = post.videoTypeId
    this.videoUrl = post.videoUrl
    this.videoBunnyId = post.videoBunnyId
    this.livestreamUrl = post.livestreamUrl
    this.isFeatured = post.isFeatured
    this.isPersonal = post.isPersonal
    this.isLive = post.isLive
    this.viewCount = post.viewCount
    this.viewCountUnique = post.viewCountUnique
    this.stateId = post.stateId
    this.paywallTypeId = post.paywallTypeId
    this.readMinutes = post.readMinutes
    this.readTime = post.readTime
    this.wordCount = post.wordCount
    this.videoSeconds = post.videoSeconds
    this.postTypeId = post.postTypeId
    this.redirectUrl = post.redirectUrl
    this.repositoryUrl = post.repositoryUrl
    this.isWatchlistSent = post.isWatchlistSent
    this.timezone = post.timezone
    this.publishAtUser = post.publishAtUser
    this.publishAt = post.publishAt?.toISO()
    this.publishAtDate = post.publishAtDateString
    this.publishAtTime = post.publishAtTimeString
    this.createdAt = post.createdAt.toISO()!
    this.updatedAt = post.updatedAt.toISO()!

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
    this.chapters = PostChapterDto.fromArray(post.chapters)
    this.captions = PostCaptionDto.fromArray(post.captions)

    this.publishAtISO = post.publishAtISO
    this.publishAtDisplay = post.publishAtDisplay
    this.rootSortOrder = post.rootSortOrder
    this.videoYouTubeId = post.videoYouTubeId
    this.videoId = post.videoId
    this.bunnyHlsUrl = post.bunnyHlsUrl
    this.bunnyFallbackUrls = post.bunnyFallbackUrls
    this.bunnySubtitleUrls = post.bunnySubtitleUrls
    this.transcriptUrl = post.transcriptUrl
    this.animatedPreviewUrl = post.animatedPreviewUrl
    this.streamId = post.streamId
    this.hasVideo = post.hasVideo
    this.watchMinutes = post.watchMinutes
    this.readMinutesDisplay = post.readMinutesDisplay
    this.routeUrl = post.routeUrl

    this.meta = post.$extras
  }
}
