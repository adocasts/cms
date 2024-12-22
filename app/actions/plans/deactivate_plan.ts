import Plan from '#models/plan'

export default class DeactivatePlan {
  static async byId(id: number) {
    const plan = await Plan.findOrFail(id)
    return this.#deactivate(plan)
  }

  static async handle(plan: Plan) {
    return this.#deactivate(plan)
  }

  static async #deactivate(plan: Plan) {
    plan.isActive = false
    await plan.save()
  }
}
