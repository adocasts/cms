import DestroyFrameworkVersion from '#actions/framework_versions/destroy_framework_version'
import GetFrameworkVersions from '#actions/framework_versions/get_framework_versions'
import StoreFrameworkVersion from '#actions/framework_versions/store_framework_version'
import UpdateFrameworkVersion from '#actions/framework_versions/update_framework_version'
import FrameworkVersionDto from '#dtos/framework_version'
import FrameworkVersion from '#models/framework_version'
import {
    frameworkVersionIndexValidator,
    frameworkVersionValidator,
} from '#validators/framework_version'
import type { HttpContext } from '@adonisjs/core/http'

export default class FrameworkVersionsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const data = await request.validateUsing(frameworkVersionIndexValidator)
    const frameworkVersions = await GetFrameworkVersions.handle()

    return inertia.render('framework_versions/index', {
      frameworkVersions: FrameworkVersionDto.fromArray(frameworkVersions),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('framework_versions/form')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(frameworkVersionValidator)

    const frameworkVersion = await StoreFrameworkVersion.handle({ data })

    session.flash('success', 'Framework version created successfully')

    return response.redirect().toRoute('framework_versions.index')
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia }: HttpContext) {
    const frameworkVersion = await FrameworkVersion.findOrFail(params.id)

    return inertia.render('framework_versions/form', {
      frameworkVersion: new FrameworkVersionDto(frameworkVersion),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(frameworkVersionValidator, { meta: { id: params.id } })

    await UpdateFrameworkVersion.handle({
      id: params.id,
      data,
    })

    session.flash('success', 'Framework version updated successfully')

    return response.redirect().toRoute('framework_versions.index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const frameworkVersion = await FrameworkVersion.findOrFail(params.id)

    await DestroyFrameworkVersion.handle(frameworkVersion)

    session.flash('success', 'Framework version deleted successfully')

    return response.redirect().toRoute('framework_versions.index')
  }
}
