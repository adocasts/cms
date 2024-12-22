import Plans from '#enums/plans'
import StripeSubscriptionStatuses from '#enums/stripe_subscription_statuses'
import Plan from '#models/plan'
import { planIndexValidator } from '#validators/plan'
import { Infer } from '@vinejs/vine/types'

type Params = Infer<typeof planIndexValidator>

export default class GetPaginatedPlans {
  static async handle({ page = 1, perPage = 25 }: Params) {
    return Plan.query()
      .withCount<'users'>('users', (query) =>
        query
          .where('planId', Plans.FOREVER)
          .orWhere('planId', Plans.FREE)
          .orWhere('stripeSubscriptionStatus', StripeSubscriptionStatuses.ACTIVE)
          .orWhere('stripeSubscriptionStatus', StripeSubscriptionStatuses.COMPLETE)
      )
      .orderBy('createdAt')
      .paginate(page, perPage)
  }
}
