import DestroyRole from '#actions/roles/destroy_role'
import GetPaginatedRoles from '#actions/roles/get_paginated_roles'
import StoreRole from '#actions/roles/store_role'
import UpdateRole from '#actions/roles/update_role'
import RoleDto from '#dtos/role'
import Role from '#models/role'
import { roleIndexValidator, roleValidator } from '#validators/role'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class RolesController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(roleIndexValidator)
    const paginator = await GetPaginatedRoles.handle(data)

    paginator.baseUrl(router.makeUrl('roles.index'))
    paginator.queryString(request.qs())

    return inertia.render('roles/index', {
      roles: RoleDto.fromPaginator(paginator, {
        start: paginator.firstPage,
        end: paginator.lastPage,
      }),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    return inertia.render('roles/form')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(roleValidator)

    await StoreRole.handle(data)

    session.flash('success', 'Role created successfully')

    return response.redirect().toRoute('roles.index')
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const role = await Role.findOrFail(params.id)

    await role.loadCount('users')

    return inertia.render('roles/form', {
      role: new RoleDto(role),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(roleValidator)

    await UpdateRole.byId(params.id, data)

    session.flash('success', 'Role updated successfully')

    return response.redirect().toRoute('roles.index')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')
    await DestroyRole.byId(params.id)

    session.flash('success', 'Role deleted successfully')

    return response.redirect().toRoute('roles.index')
  }
}
