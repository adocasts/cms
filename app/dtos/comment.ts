import { BaseModelDto } from '@adocasts.com/dto/base'
import Comment from '#models/comment'
import CommentTypes from '#enums/comment_types'
import UserDto from '#dtos/user'
import PostDto from '#dtos/post'
import LessonRequestDto from '#dtos/lesson_request'
import DiscussionDto from '#dtos/discussion'

export default class CommentDto extends BaseModelDto {
  declare id: number
  declare userId: number | null
  declare postId: number | null
  declare lessonRequestId: number | null
  declare discussionId: number | null
  declare replyTo: number | null
  declare rootParentId: number
  declare commentTypeId: CommentTypes
  declare stateId: number
  declare levelIndex: number
  declare name: string
  declare body: string
  bodyDisplay: string = ''
  declare identity: string
  declare createdAt: string
  declare updatedAt: string
  declare isPublic: boolean
  declare user: UserDto | null
  declare post: PostDto | null
  declare lessonRequest: LessonRequestDto | null
  declare discussion: DiscussionDto | null
  declare responses: CommentDto[]
  declare parent: CommentDto | null
  declare userVotes: UserDto[]
  declare createdAtCalendar: string | null
  declare timeago: string | null

  constructor(comment?: Comment) {
    super()

    if (!comment) return
    this.id = comment.id
    this.userId = comment.userId
    this.postId = comment.postId
    this.lessonRequestId = comment.lessonRequestId
    this.discussionId = comment.discussionId
    this.replyTo = comment.replyTo
    this.rootParentId = comment.rootParentId
    this.commentTypeId = comment.commentTypeId
    this.stateId = comment.stateId
    this.levelIndex = comment.levelIndex
    this.name = comment.name
    this.body = comment.body
    this.bodyDisplay = comment.bodyDisplay
    this.identity = comment.identity
    this.createdAt = comment.createdAt.toISO()!
    this.updatedAt = comment.updatedAt.toISO()!
    this.isPublic = comment.isPublic
    this.user = comment.user && new UserDto(comment.user)
    this.post = comment.post && new PostDto(comment.post)
    this.lessonRequest = comment.lessonRequest && new LessonRequestDto(comment.lessonRequest)
    this.discussion = comment.discussion && new DiscussionDto(comment.discussion)
    this.responses = CommentDto.fromArray(comment.responses)
    this.parent = comment.parent && new CommentDto(comment.parent)
    this.userVotes = UserDto.fromArray(comment.userVotes)
    this.createdAtCalendar = comment.createdAtCalendar
    this.timeago = comment.timeago
  }
}
