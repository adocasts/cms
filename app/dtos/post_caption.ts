import { BaseModelDto } from '@adocasts.com/dto/base'
import PostCaption from '#models/post_caption'
import CaptionTypes from '#enums/caption_types'
import CaptionLanguages from '#enums/caption_languages'
import PostDto from '#dtos/post'

export default class PostCaptionDto extends BaseModelDto {
  declare id: number
  declare postId: number
  declare type: CaptionTypes
  declare label: string
  declare language: CaptionLanguages
  declare filename: string
  declare sortOrder: number
  declare createdAt: string
  declare updatedAt: string
  declare post: PostDto | null

  constructor(postCaption?: PostCaption) {
    super()

    if (!postCaption) return
    this.id = postCaption.id
    this.postId = postCaption.postId
    this.type = postCaption.type
    this.label = postCaption.label
    this.language = postCaption.language
    this.filename = postCaption.filename
    this.sortOrder = postCaption.sortOrder
    this.createdAt = postCaption.createdAt.toISO()!
    this.updatedAt = postCaption.updatedAt.toISO()!
    this.post = postCaption.post && new PostDto(postCaption.post)
  }
}
