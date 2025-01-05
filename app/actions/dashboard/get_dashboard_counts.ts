import { MonthlyStat } from '#actions/stats/get_monthly'
import PostStats from '#actions/stats/post_stats'
import UserStats from '#actions/stats/user_stats'

export interface GetDashboardCountsContract {
  posts: {
    total: BigInt
    monthly: MonthlyStat[]
  }
  users: {
    total: BigInt
    monthly: MonthlyStat[]
  }
  completedLessons: {
    total: BigInt
    monthly: MonthlyStat[]
  }
  watchSeconds: {
    total: BigInt
    monthly: MonthlyStat[]
  }
  postSeconds: BigInt
}

export default class GetDashboardCounts {
  static async handle(): Promise<GetDashboardCountsContract> {
    return {
      posts: {
        total: await PostStats.getTotalPublished(),
        monthly: await PostStats.getMonthlyPublished(),
      },
      users: {
        total: await UserStats.getTotal(),
        monthly: await UserStats.getMonthlyRegistrations(),
      },
      completedLessons: {
        total: await PostStats.getLessonsUsersHaveCompleted(),
        monthly: await PostStats.getMonthlyLessonsUsersHaveCompleted(),
      },
      watchSeconds: {
        total: await PostStats.getLessonsWatchDuration(),
        monthly: await PostStats.getMonthlyLessonsWatchDuration(),
      },
      postSeconds: await PostStats.getTotalPostSeconds(),
    }
  }
}
