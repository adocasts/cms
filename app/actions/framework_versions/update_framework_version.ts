import FrameworkVersion from '#models/framework_version'
import { frameworkVersionValidator } from '#validators/framework_version'
import { Infer } from '@vinejs/vine/types'

type Params = {
  id: number
  data: Infer<typeof frameworkVersionValidator>
}

export default class UpdateFrameworkVersion {
  static async handle({ id, data }: Params) {
    const frameworkVersion = await FrameworkVersion.findOrFail(id)
    frameworkVersion.merge(data)
    await frameworkVersion.save()
    return frameworkVersion
  }
}
