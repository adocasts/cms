import Plan from '#models/plan'
import { planValidator } from '#validators/plan'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof planValidator>

export default class StorePlan {
  static async handle(data: Params) {
    return Plan.create(data)
  }
}
