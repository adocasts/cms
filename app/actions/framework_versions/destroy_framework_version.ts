import FrameworkVersion from '#models/framework_version'

export default class DestroyFrameworkVersion {
  static async handle(frameworkVersion: FrameworkVersion) {
    await frameworkVersion.related('collections').detach()
    await frameworkVersion.related('posts').detach()
    await frameworkVersion.delete()
  }
}
