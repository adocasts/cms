import ActivatePlan from '#actions/plans/activate_plan'
import DeactivatePlan from '#actions/plans/deactivate_plan'
import DestroyPlan from '#actions/plans/destroy_plan'
import GetPaginatedPlans from '#actions/plans/get_paginated_plans'
import StorePlan from '#actions/plans/store_plan'
import UpdatePlan from '#actions/plans/update_plan'
import PlanDto from '#dtos/plan'
import Plan from '#models/plan'
import { planIndexValidator, planValidator } from '#validators/plan'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class PlansController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(planIndexValidator)
    const paginator = await GetPaginatedPlans.handle(data)

    paginator.baseUrl(router.makeUrl('plans.index'))
    paginator.queryString(request.qs())

    return inertia.render('plans/index', {
      plans: PlanDto.fromPaginator(paginator, {
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

    return inertia.render('plans/form')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(planValidator)

    await StorePlan.handle(data)

    session.flash('success', 'Plan created successfully')

    return response.redirect().toRoute('plans.index')
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const plan = await Plan.findOrFail(params.id)

    await plan.loadCount('users')

    return inertia.render('plans/form', {
      plan: new PlanDto(plan),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(planValidator, { meta: { id: params.id } })

    await UpdatePlan.byId(params.id, data)

    session.flash('success', 'Plan updated successfully')

    return response.redirect().toRoute('plans.index')
  }

  async activate({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    await ActivatePlan.byId(params.id)

    session.flash('success', 'Plan activated successfully')

    return response.redirect().toRoute('plans.index')
  }

  async deactivate({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    await DeactivatePlan.byId(params.id)

    session.flash('success', 'Plan deactivated successfully')

    return response.redirect().toRoute('plans.index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')
    await DestroyPlan.byId(params.id)

    session.flash('success', 'Plan deleted successfully')

    return response.redirect().toRoute('plans.index')
  }
}
