import FrameworkVersion from '#models/framework_version'
import { frameworkVersionValidator } from '#validators/framework_version'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof frameworkVersionValidator>
}

export default class StoreFrameworkVersion {
  static async handle({ data }: Params) {
    return await FrameworkVersion.create(data)
  }
}
