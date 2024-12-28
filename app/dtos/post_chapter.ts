import { BaseModelDto } from '@adocasts.com/dto/base'
import PostChapter from '#models/post_chapter'
import PostDto from '#dtos/post'

export default class PostChapterDto extends BaseModelDto {
  declare id: number
  declare postId: number
  declare start: string
  declare end: string
  declare text: string
  declare sortOrder: number
  declare createdAt: string
  declare updatedAt: string
  declare post: PostDto | null
  declare startSeconds: number
  declare endSeconds: number

  constructor(postChapter?: PostChapter) {
    super()

    if (!postChapter) return
    this.id = postChapter.id
    this.postId = postChapter.postId
    this.start = postChapter.start
    this.end = postChapter.end
    this.text = postChapter.text
    this.sortOrder = postChapter.sortOrder
    this.createdAt = postChapter.createdAt.toISO()!
    this.updatedAt = postChapter.updatedAt.toISO()!
    this.post = postChapter.post && new PostDto(postChapter.post)
    this.startSeconds = postChapter.startSeconds
    this.endSeconds = postChapter.endSeconds
  }
}
