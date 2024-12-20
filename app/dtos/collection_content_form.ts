import type Post from '#models/post'
import CollectionDto from './collection.js'
import PostDto from './post.js'

export class CollectionPostFormDto {
  declare id: number
  declare title: string
  declare slug: string
  declare publishAt?: string | null
  declare order: number

  constructor(post?: Post | PostDto) {
    if (!post) return

    this.id = post.id
    this.title = post.title
    this.slug = post.slug

    if ('$extras' in post) {
      this.publishAt = post.publishAt?.toISO()
      this.order = post.$extras.pivot_sort_order
    } else {
      this.publishAt = post.publishAt
      this.order = post.meta.pivot_sort_order
    }
  }

  static fromArray(posts: Post[] | PostDto[] = []) {
    return posts.map((post) => new CollectionPostFormDto(post))
  }
}

export class CollectionModuleFormDto {
  declare id: number
  declare name: string
  declare order: number
  declare posts: CollectionPostFormDto[]

  constructor(collection?: CollectionDto | Partial<CollectionModuleFormDto>) {
    if (!collection) return

    this.id = collection.id!
    this.name = collection.name ?? 'My cool module'

    if ('moduleNumber' in collection) {
      this.order = collection.moduleNumber
      this.posts = CollectionPostFormDto.fromArray(collection.posts)
    } else {
      this.order = collection.order ?? 1
      this.posts = collection.posts ?? []
    }
  }

  static fromArray(collections: CollectionDto[] = []) {
    return collections.map((col) => new CollectionModuleFormDto(col))
  }
}
