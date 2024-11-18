import { BaseModelDto } from '@adocasts.com/dto/base'
import LessonRequest from '#models/lesson_request'
import UserDto from '#dtos/user'
import CommentDto from '#dtos/comment'
import RequestPriorities from '#enums/request_priorities'
import States from '#enums/states'

export default class LessonRequestDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare stateId: States
  declare approveCommentId: number | null
  declare rejectCommentId: number | null
  declare completeCommentId: number | null
  declare name: string
  declare body: string
  bodyDisplay: string = ''
  priority: number = RequestPriorities.NORMAL
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare approveComment: CommentDto | null
  declare rejectComment: CommentDto | null
  declare completeComment: CommentDto | null
  declare comments: CommentDto[]
  declare votes: UserDto[]
  declare state: string

  constructor(lessonRequest?: LessonRequest) {
    super()

    if (!lessonRequest) return
    this.id = lessonRequest.id
    this.userId = lessonRequest.userId
    this.stateId = lessonRequest.stateId
    this.approveCommentId = lessonRequest.approveCommentId
    this.rejectCommentId = lessonRequest.rejectCommentId
    this.completeCommentId = lessonRequest.completeCommentId
    this.name = lessonRequest.name
    this.body = lessonRequest.body
    this.bodyDisplay = lessonRequest.bodyDisplay
    this.priority = lessonRequest.priority
    this.createdAt = lessonRequest.createdAt.toISO()!
    this.updatedAt = lessonRequest.updatedAt.toISO()!
    this.user = lessonRequest.user && new UserDto(lessonRequest.user)
    this.approveComment =
      lessonRequest.approveComment && new CommentDto(lessonRequest.approveComment)
    this.rejectComment = lessonRequest.rejectComment && new CommentDto(lessonRequest.rejectComment)
    this.completeComment =
      lessonRequest.completeComment && new CommentDto(lessonRequest.completeComment)
    this.comments = CommentDto.fromArray(lessonRequest.comments)
    this.votes = UserDto.fromArray(lessonRequest.votes)
    this.state = lessonRequest.state
  }
}
