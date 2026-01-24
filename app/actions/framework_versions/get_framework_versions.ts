import FrameworkVersion from '#models/framework_version'

export default class GetFrameworkVersions {
  static async handle() {
    return await FrameworkVersion.query().orderBy('slug')
  }
}
