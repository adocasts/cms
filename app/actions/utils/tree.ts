import Collection from '#models/collection'
import Taxonomy from '#models/taxonomy'

export interface TreeContract {
  id: number
  parentId?: number | null
  name: string
  children: TreeContract[] | null
}

export default class Tree {
  static async handle(records: Partial<Taxonomy>[] | Partial<Collection>[]) {
    const items = records.map((record) => ({
      id: record.id!,
      parentId: record.parentId,
      name: record.name!,
      children: [],
    }))

    return this.#fillChildren(items)
  }

  static #fillChildren(items: TreeContract[], parentId: number | null = null) {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        item.children = this.#fillChildren(items, item.id)
        return item
      })
  }
}
