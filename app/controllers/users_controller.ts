import GetPaginatedUsers from '#actions/users/get_paginated_users'
import GetUser from '#actions/users/get_user'
import UpdateUserRole from '#actions/users/update_user_role'
import UserDto from '#dtos/user'
import { userIndexValidator, userRoleValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class UsersController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(userIndexValidator)
    const paginator = await GetPaginatedUsers.handle(data)

    paginator.baseUrl(router.makeUrl('users.index'))
    paginator.queryString(request.qs())

    return inertia.render('users/index', {
      roleId: data.roleId,
      term: data.term,
      users: UserDto.fromPaginator(paginator, {
        start: paginator.firstPage,
        end: paginator.lastPage,
      }),
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const user = await GetUser.byId(params.id)

    return inertia.render('users/show', {
      user: new UserDto(user),
    })
  }

  async role({ request, response, params, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(userRoleValidator)
    const user = await UpdateUserRole.byId(params.id, data)

    session.flash('success', 'Role updated successfully')

    return response.redirect().toRoute('users.show', { id: user.id })
  }

  async destroy({}: HttpContext) {}
}
