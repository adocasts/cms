import Tree from '#actions/utils/tree'
import Taxonomy from '#models/taxonomy'

export default class GetTaxonomyTree {
  static async handle() {
    const items = await Taxonomy.query().select('id', 'name', 'parentId')

    return Tree.handle(items)
  }
}
