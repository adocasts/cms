import Plan from '#models/plan'
import { couponValidator } from '#validators/coupon'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof couponValidator>

export default class RunCoupon {
  static async handle({ planIds, ...data }: Params) {
    const plans = await Plan.query().whereIn('id', planIds)

    await db.transaction(async (trx) => {
      for (const plan of plans) {
        await plan.useTransaction(trx)
        await plan.merge(data).save()
      }
    })
  }
}
