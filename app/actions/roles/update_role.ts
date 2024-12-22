import Role from '#models/role'
import { roleValidator } from '#validators/role'
import { Infer } from '@vinejs/vine/types'

type Data = Infer<typeof roleValidator>

export default class UpdateRole {
  static async byId(id: number, data: Data) {
    const role = await Role.findOrFail(id)
    return this.handle(role, data)
  }

  static async handle(role: Role, data: Data) {
    await this.#update(role, data)
    return role
  }

  static async #update(role: Role, data: Data) {
    await role.merge(data).save()
  }
}
