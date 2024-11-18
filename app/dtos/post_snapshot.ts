import { BaseModelDto } from '@adocasts.com/dto/base'
import PostSnapshot from '#models/post_snapshot'
import PostDto from '#dtos/post'

export default class PostSnapshotDto extends BaseModelDto {
  declare id: number
  declare postId: number
  declare revision: number
  declare revisionDate: string
  declare revisedBy: number
  declare title: string
  declare slug: string
  declare pageTitle: string | null
  declare description: string | null
  declare metaDescription: string | null
  declare canonical: string | null
  declare body: string | null
  declare videoUrl: string | null
  declare isFeatured: boolean | null
  declare isPersonal: boolean | null
  declare viewCount: number | null
  declare viewCountUnique: number | null
  declare stateId: number | null
  declare timezone: string | null
  declare publishAtUser: string | null
  declare publishAt: string | null
  declare deletedAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare post: PostDto | null

  constructor(postSnapshot?: PostSnapshot) {
    super()

    if (!postSnapshot) return
    this.id = postSnapshot.id
    this.postId = postSnapshot.postId
    this.revision = postSnapshot.revision
    this.revisionDate = postSnapshot.revisionDate.toISO()!
    this.revisedBy = postSnapshot.revisedBy
    this.title = postSnapshot.title
    this.slug = postSnapshot.slug
    this.pageTitle = postSnapshot.pageTitle
    this.description = postSnapshot.description
    this.metaDescription = postSnapshot.metaDescription
    this.canonical = postSnapshot.canonical
    this.body = postSnapshot.body
    this.videoUrl = postSnapshot.videoUrl
    this.isFeatured = postSnapshot.isFeatured
    this.isPersonal = postSnapshot.isPersonal
    this.viewCount = postSnapshot.viewCount
    this.viewCountUnique = postSnapshot.viewCountUnique
    this.stateId = postSnapshot.stateId
    this.timezone = postSnapshot.timezone
    this.publishAtUser = postSnapshot.publishAtUser
    this.publishAt = postSnapshot.publishAt?.toISO()!
    this.deletedAt = postSnapshot.deletedAt?.toISO()!
    this.createdAt = postSnapshot.createdAt.toISO()!
    this.updatedAt = postSnapshot.updatedAt.toISO()!
    this.post = postSnapshot.post && new PostDto(postSnapshot.post)
  }
}