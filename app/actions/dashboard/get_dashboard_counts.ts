import Collection from '#models/collection'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import User from '#models/user'

export interface GetDashboardCountsContract {
  posts: BigInt
  postSeconds: BigInt
  series: BigInt
  topics: BigInt
  users: BigInt
}

export default class GetDashboardCounts {
  static async handle(): Promise<GetDashboardCountsContract> {
    return {
      posts: await this.#countPublishedPosts(),
      postSeconds: await this.#countPostSeconds(),
      series: await this.#countSeries(),
      topics: await this.#countTopics(),
      users: await this.#countUsers(),
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

  static async #countUsers() {
    return User.query().getCount()
  }
}
