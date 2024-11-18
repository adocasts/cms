import { BaseModelDto } from '@adocasts.com/dto/base'
import DiscussionVote from '#models/discussion_vote'
import UserDto from '#dtos/user'
import DiscussionDto from '#dtos/discussion'

export default class DiscussionVoteDto extends BaseModelDto {
  declare id: number
  declare userId: number | null
  declare discussionId: number | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare discussion: DiscussionDto | null

  constructor(discussionVote?: DiscussionVote) {
    super()

    if (!discussionVote) return
    this.id = discussionVote.id
    this.userId = discussionVote.userId
    this.discussionId = discussionVote.discussionId
    this.createdAt = discussionVote.createdAt.toISO()!
    this.updatedAt = discussionVote.updatedAt.toISO()!
    this.user = discussionVote.user && new UserDto(discussionVote.user)
    this.discussion = discussionVote.discussion && new DiscussionDto(discussionVote.discussion)
  }
}