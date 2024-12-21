import User from '#models/user'
import Collection from '#models/collection'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import CmsPolicy from './cms_policy.js'

export default class CollectionPolicy extends CmsPolicy {
  public viewList(user: User): AuthorizerResponse {
    return this.isLvl2Contributor(user)
  }

  public feature(_user: User): AuthorizerResponse {
    return false
  }

  public create(user: User): AuthorizerResponse {
    return this.isLvl2Contributor(user)
  }

  public update(user: User): AuthorizerResponse {
    return this.isLvl2Contributor(user)
  }

  public destroy(user: User, collection: Collection): AuthorizerResponse {
    return this.isOwner(user, collection)
  }

  public isOwner(user: User, collection: Collection): AuthorizerResponse {
    if (!collection) return this.isLvl2Contributor(user)
    return collection.ownerId === user.id
  }
}
