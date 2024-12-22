import Plans from '#enums/plans'
import Plan from '#models/plan'
import db from '@adonisjs/lucid/services/db'

export default class ClearCoupons {
  static async handle() {
    const plans = await Plan.query().whereNot('id', Plans.FREE)

    await db.transaction(async (trx) => {
      for (const plan of plans) {
        await plan.useTransaction(trx)

        plan.couponCode = null
        plan.couponDiscountFixed = null
        plan.couponDiscountPercent = null
        plan.couponStartAt = null
        plan.couponEndAt = null
        plan.couponDurationId = null
        plan.stripeCouponId = null

        await plan.save()
      }
    })
  }
}
