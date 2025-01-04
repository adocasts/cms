import { MonthlyStat } from '#actions/stats/get_monthly'
import UserStats from '#actions/stats/user_stats'
import Collection from '#models/collection'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'

export interface GetDashboardCountsContract {
  posts: BigInt
  postSeconds: BigInt
  series: BigInt
  topics: BigInt
  users: {
    total: bigint
    monthly: MonthlyStat[]
  }
}

export default class GetDashboardCounts {
  static async handle(): Promise<GetDashboardCountsContract> {
    return {
      posts: await this.#countPublishedPosts(),
      postSeconds: await this.#countPostSeconds(),
      series: await this.#countSeries(),
      topics: await this.#countTopics(),
      users: {
        total: await UserStats.getTotal(),
        monthly: await UserStats.getMonthlyRegistrations(),
      },
    }
  }

  static async #countPublishedPosts() {
    return Post.query()
      .apply((scope) => scope.published())
      .getCount()
  }

  static async #countPostSeconds() {
    return Post.query()
      .apply((scope) => scope.published())
      .getSum('video_seconds')
  }

  static async #countSeries() {
    return Collection.query().wherePublic().whereNull('parentId').getCount()
  }

  static async #countTopics() {
    return Taxonomy.query().getCount()
  }
}
