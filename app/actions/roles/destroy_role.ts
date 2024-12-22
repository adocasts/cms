import HttpStatus from '#enums/http_statuses'
import Role from '#models/role'
import { Exception } from '@adonisjs/core/exceptions'

export default class DestroyRole {
  static async byId(id: number) {
    const role = await Role.findOrFail(id)
    return this.#destroy(role)
  }

  static async handle(role: Role) {
    return this.#destroy(role)
  }

  static async #destroy(role: Role) {
    const users = await role.related('users').query().getCount()

    if (Number(users) > 0) {
      throw new Exception('Cannot delete a role with users associated', {
        status: HttpStatus.BAD_REQUEST,
        code: 'E_ROLE_HAS_USERS',
      })
    }

    await role.delete()
  }
}
