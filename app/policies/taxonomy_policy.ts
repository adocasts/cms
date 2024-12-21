import User from '#models/user'
import Taxonomy from '#models/taxonomy'
import CmsPolicy from './cms_policy.js'

export default class TaxonomyPolicy extends CmsPolicy {
  public viewList(user: User) {
    return this.isLvl2Contributor(user)
  }

  public feature(_user: User) {
    return false
  }

  public create(user: User) {
    return this.isLvl2Contributor(user)
  }

  public update(user: User, _taxonomy: Taxonomy) {
    return this.isLvl2Contributor(user)
  }

  public async destroy(user: User, taxonomy: Taxonomy) {
    return this.isOwner(user, taxonomy)
  }

  public async isOwner(user: User, taxonomy: Taxonomy) {
    if (!taxonomy) return this.isLvl2Contributor(user)
    return taxonomy.ownerId === user.id
  }
}
