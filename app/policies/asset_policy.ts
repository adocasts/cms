import User from '#models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import CmsPolicy from './cms_policy.js'

export default class AssetPolicy extends CmsPolicy {
  public store(user: User): AuthorizerResponse {
    return this.isLvl1Contributor(user)
  }

  public destroy(user: User): AuthorizerResponse {
    return this.isLvl1Contributor(user)
  }
}
