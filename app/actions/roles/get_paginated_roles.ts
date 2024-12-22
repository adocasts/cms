import Role from '#models/role'
import { roleIndexValidator } from '#validators/role'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof roleIndexValidator>

export default class GetPaginatedRoles {
  static async handle({ page = 1, perPage = 25 }: Params) {
    return Role.query().withCount('users').orderBy('createdAt').paginate(page, perPage)
  }
}
