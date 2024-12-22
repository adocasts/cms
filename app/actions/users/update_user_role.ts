import Roles, { RoleWeights } from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import { userRoleValidator } from '#validators/user'
import emitter from '@adonisjs/core/services/emitter'
import { Infer } from '@vinejs/vine/types'

type Data = Infer<typeof userRoleValidator>

export default class UpdateUserRole {
  static async byId(id: number, data: Data) {
    const user = await User.findOrFail(id)
    return this.#updateRole(user, data)
  }

  static async #updateRole(user: User, data: Data) {
    const oldRole = await user.related<'role'>('role').query().firstOrFail()
    const newRole = await Role.findOrFail(data.roleId)

    await user.merge(data).save()
    await this.#sendRoleUpdateNotification(user, newRole, oldRole)

    return user
  }

  static async #sendRoleUpdateNotification(user: User, newRole: Role, oldRole: Role) {
    const oldRoleWeight = RoleWeights.findIndex((id) => id === oldRole.id)
    const newRoleWeight = RoleWeights.findIndex((id) => id === newRole.id)

    if (oldRoleWeight >= newRoleWeight) return

    switch (newRole.id) {
      case Roles.CONTRIBUTOR_LVL_1:
        return emitter.emit('role:upgrade:contributor_lvl_1', { user, newRole, oldRole })
      case Roles.CONTRIBUTOR_LVL_2:
        return emitter.emit('role:upgrade:contributor_lvl_2', { user, newRole, oldRole })
      case Roles.ADMIN:
        return emitter.emit('role:upgrade:admin', { user, newRole, oldRole })
    }
  }
}
