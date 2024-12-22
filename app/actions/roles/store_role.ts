import Role from '#models/role'
import { roleValidator } from '#validators/role'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof roleValidator>

export default class StoreRole {
  static async handle(data: Params) {
    return Role.create(data)
  }
}
