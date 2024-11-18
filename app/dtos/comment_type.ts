import { BaseModelDto } from '@adocasts.com/dto/base'
import CommentType from '#models/comment_type'

export default class CommentTypeDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string

  constructor(commentType?: CommentType) {
    super()

    if (!commentType) return
    this.id = commentType.id
    this.name = commentType.name
    this.createdAt = commentType.createdAt.toISO()!
    this.updatedAt = commentType.updatedAt.toISO()!
  }
}