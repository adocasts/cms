import Plan from '#models/plan'
import { planValidator } from '#validators/plan'
import { Infer } from '@vinejs/vine/types'

type Data = Infer<typeof planValidator>

export default class UpdatePlan {
  static async byId(id: number, data: Data) {
    const plan = await Plan.findOrFail(id)
    return this.handle(plan, data)
  }

  static async handle(plan: Plan, data: Data) {
    await this.#update(plan, data)
    return plan
  }

  static async #update(plan: Plan, data: Data) {
    await plan.merge(data).save()
  }
}
