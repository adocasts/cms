import ClearCoupons from '#actions/coupons/clear_coupons'
import RunCoupon from '#actions/coupons/run_coupon'
import PlanDto from '#dtos/plan'
import Plans from '#enums/plans'
import Plan from '#models/plan'
import { couponValidator } from '#validators/coupon'
import type { HttpContext } from '@adonisjs/core/http'

export default class CouponsController {
  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const plans = await Plan.query().whereNot('id', Plans.FREE)

    return inertia.render('coupons/form', {
      plans: PlanDto.fromArray(plans),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async run({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    const data = await request.validateUsing(couponValidator)

    await RunCoupon.handle(data)

    session.flash('success', 'Coupon updated successfully')

    return response.redirect().toRoute('plans.index')
  }

  /**
   * Delete record
   */
  async clear({ response, session, bouncer }: HttpContext) {
    await bouncer.with('CmsPolicy').authorize('adminOnly')

    await ClearCoupons.handle()

    session.flash('success', 'Coupons cleared successfully')

    return response.redirect().toRoute('plans.index')
  }
}
