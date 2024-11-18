import { BaseModelDto } from '@adocasts.com/dto/base'
import Question from '#models/question'
import UserDto from '#dtos/user'

export default class QuestionDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare title: string
  declare body: string
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare userVotes: UserDto[]

  constructor(question?: Question) {
    super()

    if (!question) return
    this.id = question.id
    this.userId = question.userId
    this.title = question.title
    this.body = question.body
    this.createdAt = question.createdAt.toISO()!
    this.updatedAt = question.updatedAt.toISO()!
    this.user = question.user && new UserDto(question.user)
    this.userVotes = UserDto.fromArray(question.userVotes)
  }
}