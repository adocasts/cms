import User from '#models/user'
import { userIndexValidator } from '#validators/user'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof userIndexValidator>

export default class GetPaginatedUsers {
  static async handle({ page = 1, perPage = 100, roleId, planId, term }: Params) {
    return User.query()
      .if(term, (query) =>
        query.whereILike('username', `%${term}%`).orWhereILike('email', `%${term}%`)
      )
      .if(roleId, (query) => query.where({ roleId }))
      .if(planId, (query) => query.where({ planId }))
      .preload('profile')
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)
  }
}
