import { BaseModelDto } from '@adocasts.com/dto/base'
import RequestVote from '#models/request_vote'
import UserDto from '#dtos/user'
import LessonRequestDto from '#dtos/lesson_request'

export default class RequestVoteDto extends BaseModelDto {
  declare id: number
  declare userId: number | null
  declare lessonRequestId: number | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare lessonRequest: LessonRequestDto | null

  constructor(requestVote?: RequestVote) {
    super()

    if (!requestVote) return
    this.id = requestVote.id
    this.userId = requestVote.userId
    this.lessonRequestId = requestVote.lessonRequestId
    this.createdAt = requestVote.createdAt.toISO()!
    this.updatedAt = requestVote.updatedAt.toISO()!
    this.user = requestVote.user && new UserDto(requestVote.user)
    this.lessonRequest =
      requestVote.lessonRequest && new LessonRequestDto(requestVote.lessonRequest)
  }
}
