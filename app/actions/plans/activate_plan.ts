import Plan from '#models/plan'

export default class ActivatePlan {
  static async byId(id: number) {
    const plan = await Plan.findOrFail(id)
    return this.#activate(plan)
  }

  static async handle(plan: Plan) {
    return this.#activate(plan)
  }

  static async #activate(plan: Plan) {
    plan.isActive = true
    await plan.save()
  }
}
