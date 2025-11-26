import AssetDto from '#dtos/asset'
import CaptionLanguages from '#enums/caption_languages'
import CaptionTypes from '#enums/caption_types'
import PaywallTypes from '#enums/paywall_types'
import PostTypes from '#enums/post_types'
import RepositoryAccessLevels from '#enums/repository_access_levels'
import States from '#enums/states'
import VideoTypes from '#enums/video_types'
import Post from '#models/post'
import { BaseModelDto } from '@adocasts.com/dto/base'

type Caption = {
  id?: number
  type: CaptionTypes
  language: CaptionLanguages
  label: string
}

type Chapter = {
  id?: number
  start: string
  end: string
  text: string
}

export default class PostFormDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare slug: string
  declare pageTitle: string | null
  declare description: string | null
  declare metaDescription: string | null
  declare canonical: string | null
  declare body: string | null
  declare bodyTypeId: number
  declare videoTypeId: VideoTypes | null
  declare videoUrl: string | null
  declare videoBunnyId: string | null
  declare livestreamUrl: string | null
  declare isFeatured: boolean | null
  declare isPersonal: boolean | null
  declare isLive: boolean | null
  declare stateId: States
  declare paywallTypeId: PaywallTypes
  declare videoSeconds: number
  declare postTypeId: PostTypes
  declare redirectUrl: string
  declare repositoryUrl: string
  declare repositoryAccessLevel: RepositoryAccessLevels
  declare timezone: string | null
  declare publishAtDate?: string | null
  declare publishAtTime?: string | null
  declare createdAt: string
  declare updatedAt: string

  declare thumbnail: AssetDto | null
  declare cover: AssetDto | null
  declare taxonomyIds: number[]
  declare captions: Caption[] | null
  declare chapters: Chapter[] | null

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
    this.bodyTypeId = post.bodyTypeId
    this.videoTypeId = post.videoTypeId
    this.videoUrl = post.videoUrl
    this.videoBunnyId = post.videoBunnyId
    this.livestreamUrl = post.livestreamUrl
    this.isFeatured = post.isFeatured
    this.isPersonal = post.isPersonal
    this.isLive = post.isLive
    this.stateId = post.stateId
    this.paywallTypeId = post.paywallTypeId
    this.videoSeconds = post.videoSeconds
    this.postTypeId = post.postTypeId
    this.redirectUrl = post.redirectUrl
    this.repositoryUrl = post.repositoryUrl
    this.repositoryAccessLevel = post.repositoryAccessLevel
    this.timezone = post.timezone
    this.publishAtDate = post.publishAtDateString
    this.publishAtTime = post.publishAtTimeString
    this.createdAt = post.createdAt.toISO()!
    this.updatedAt = post.updatedAt.toISO()!

    this.thumbnail = post.thumbnails.length ? new AssetDto(post.thumbnails[0]) : null
    this.cover = post.covers.length ? new AssetDto(post.covers[0]) : null
    this.taxonomyIds = post.taxonomies?.map((row) => row.id) ?? []

    if (post.captions?.length) {
      this.captions = post.captions.map((row) => ({
        id: row.id,
        type: row.type,
        language: row.language,
        label: row.label,
      }))
    }

    if (post.chapters?.length) {
      this.chapters = post.chapters.map((row) => ({
        id: row.id,
        start: row.start,
        end: row.end,
        text: row.text,
      }))
    }
  }
}
