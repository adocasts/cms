import Roles from '#enums/roles'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class CmsPolicy extends BasePolicy {
  // #region Global Hooks

  public async before(user: User | null) {
    // all the admin all studio access
    if (this.isAdmin(user)) {
      return true
    }
  }

  // #endregion

  // #region Global Policies

  public adminOnly(_: User) {
    return false
  }

  public viewDashboard(user: User) {
    return this.isLvl1Contributor(user)
  }

  public viewComments(user: User) {
    return this.isAuthenticated(user)
  }

  public viewUsers(_user: User) {
    return false
  }

  // #endregion

  // #region Global Helpers

  protected isAdmin(user: User | null) {
    return user?.roleId === Roles.ADMIN
  }

  protected isLvl1Contributor(user: User | null) {
    return (
      this.isAdmin(user) ||
      user?.roleId === Roles.CONTRIBUTOR_LVL_1 ||
      user?.roleId === Roles.CONTRIBUTOR_LVL_2
    )
  }

  protected isLvl2Contributor(user: User | null) {
    return this.isAdmin(user) || user?.roleId === Roles.CONTRIBUTOR_LVL_2
  }

  protected isAuthenticated(user: User | null) {
    return !!user
  }

  // #endregion
}
