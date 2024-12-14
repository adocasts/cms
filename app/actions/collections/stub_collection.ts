import Collection from '#models/collection'
import User from '#models/user'
import { collectionStubValidator } from '#validators/collection'
import { Infer } from '@vinejs/vine/types'

type Params = {
  user: User
  data: Infer<typeof collectionStubValidator>
}

export default class StubCollection {
  static async handle({ user, data }: Params) {
    return Collection.create({
      parentId: data.parentId,
      name: data.name ?? 'Your new module',
      ownerId: user.id,
    })
  }
}
