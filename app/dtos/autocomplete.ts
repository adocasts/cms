import Collection from '#models/collection'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import { BaseDto } from '@adocasts.com/dto/base'

export default class AutocompleteDto extends BaseDto {
  declare id: number
  declare name: string
  declare slug: string

  constructor(item: Post | Collection | Taxonomy) {
    super()

    switch (true) {
      case item instanceof Post:
        this.id = item.id
        this.name = item.title
        this.slug = item.slug
        break
      case item instanceof Collection:
        this.id = item.id
        this.name = item.name
        this.slug = item.slug
        break
      case item instanceof Taxonomy:
        this.id = item.id
        this.name = item.name
        this.slug = item.slug
        break
    }
  }
}
