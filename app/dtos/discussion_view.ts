import { BaseModelDto } from '@adocasts.com/dto/base'
import DiscussionView from '#models/discussion_view'
import DiscussionViewTypes from '#enums/discussion_view_types'
import UserDto from '#dtos/user'
import DiscussionDto from '#dtos/discussion'

export default class DiscussionViewDto extends BaseModelDto {
  declare id: number
  declare userId: number | null
  declare discussionId: number
  declare typeId: DiscussionViewTypes
  declare ipAddress: string
  declare userAgent: string
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare discussion: DiscussionDto | null

  constructor(discussionView?: DiscussionView) {
    super()

    if (!discussionView) return
    this.id = discussionView.id
    this.userId = discussionView.userId
    this.discussionId = discussionView.discussionId
    this.typeId = discussionView.typeId
    this.ipAddress = discussionView.ipAddress
    this.userAgent = discussionView.userAgent
    this.createdAt = discussionView.createdAt.toISO()!
    this.updatedAt = discussionView.updatedAt.toISO()!
    this.user = discussionView.user && new UserDto(discussionView.user)
    this.discussion = discussionView.discussion && new DiscussionDto(discussionView.discussion)
  }
}