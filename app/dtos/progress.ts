import { BaseModelDto } from '@adocasts.com/dto/base'
import Progress from '#models/progress'
import PostDto from '#dtos/post'
import CollectionDto from '#dtos/collection'

export default class ProgressDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare postId: number | null
  declare collectionId: number | null
  declare readPercent: number | null
  declare watchPercent: number | null
  declare watchSeconds: number
  declare isCompleted: boolean
  declare createdAt: string
  declare updatedAt: string
  declare post: PostDto | null
  declare collection: CollectionDto | null
  declare hasActivity: boolean

  constructor(progress?: Progress) {
    super()

    if (!progress) return
    this.id = progress.id
    this.userId = progress.userId
    this.postId = progress.postId
    this.collectionId = progress.collectionId
    this.readPercent = progress.readPercent
    this.watchPercent = progress.watchPercent
    this.watchSeconds = progress.watchSeconds
    this.isCompleted = progress.isCompleted
    this.createdAt = progress.createdAt.toISO()!
    this.updatedAt = progress.updatedAt.toISO()!
    this.post = progress.post && new PostDto(progress.post)
    this.collection = progress.collection && new CollectionDto(progress.collection)
    this.hasActivity = progress.hasActivity
  }
}
