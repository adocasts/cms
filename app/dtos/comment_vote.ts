import { BaseModelDto } from '@adocasts.com/dto/base'
import CommentVote from '#models/comment_vote'
import UserDto from '#dtos/user'
import CommentDto from '#dtos/comment'

export default class CommentVoteDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare commentId: number
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare comment: CommentDto | null

  constructor(commentVote?: CommentVote) {
    super()

    if (!commentVote) return
    this.id = commentVote.id
    this.userId = commentVote.userId
    this.commentId = commentVote.commentId
    this.createdAt = commentVote.createdAt.toISO()!
    this.updatedAt = commentVote.updatedAt.toISO()!
    this.user = commentVote.user && new UserDto(commentVote.user)
    this.comment = commentVote.comment && new CommentDto(commentVote.comment)
  }
}