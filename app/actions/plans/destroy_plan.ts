import HttpStatus from '#enums/http_statuses'
import Plan from '#models/plan'
import { Exception } from '@adonisjs/core/exceptions'

export default class DestroyPlan {
  static async byId(id: number) {
    const plan = await Plan.findOrFail(id)
    return this.#destroy(plan)
  }

  static async handle(plan: Plan) {
    return this.#destroy(plan)
  }

  static async #destroy(plan: Plan) {
    const users = await plan.related('users').query().getCount()

    if (Number(users) > 0) {
      throw new Exception(
        'Cannot delete a plan with users associated; consider deactivating instead',
        {
          status: HttpStatus.BAD_REQUEST,
          code: 'E_PLAN_HAS_USERS',
        }
      )
    }

    await plan.delete()
  }
}
