import { BaseModelDto } from '@adocasts.com/dto/base'
import Discussion from '#models/discussion'
import UserDto from '#dtos/user'
import TaxonomyDto from '#dtos/taxonomy'
import CommentDto from '#dtos/comment'
import DiscussionViewDto from '#dtos/discussion_view'

export default class DiscussionDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare taxonomyId: number
  declare stateId: number
  declare title: string
  declare slug: string
  declare body: string
  declare createdAt: string
  declare updatedAt: string
  declare createdAtDisplay: string
  declare updatedAtDisplay: string
  declare createdAgo: string | null
  declare updatedAgo: string | null
  declare user: UserDto | null
  declare taxonomy: TaxonomyDto | null
  declare comments: CommentDto[]
  declare views: DiscussionViewDto[]
  declare impressions: DiscussionViewDto[]
  declare votes: UserDto[]

  constructor(discussion?: Discussion) {
    super()

    if (!discussion) return
    this.id = discussion.id
    this.userId = discussion.userId
    this.taxonomyId = discussion.taxonomyId
    this.stateId = discussion.stateId
    this.title = discussion.title
    this.slug = discussion.slug
    this.body = discussion.body
    this.createdAt = discussion.createdAt.toISO()!
    this.updatedAt = discussion.updatedAt.toISO()!
    this.createdAtDisplay = discussion.createdAtDisplay
    this.updatedAtDisplay = discussion.updatedAtDisplay
    this.createdAgo = discussion.createdAgo
    this.updatedAgo = discussion.updatedAgo
    this.user = discussion.user && new UserDto(discussion.user)
    this.taxonomy = discussion.taxonomy && new TaxonomyDto(discussion.taxonomy)
    this.comments = CommentDto.fromArray(discussion.comments)
    this.views = DiscussionViewDto.fromArray(discussion.views)
    this.impressions = DiscussionViewDto.fromArray(discussion.impressions)
    this.votes = UserDto.fromArray(discussion.votes)
  }
}
