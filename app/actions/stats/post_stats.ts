import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import GetMonthly from './get_monthly.js'
import Post from '#models/post'
import States from '#enums/states'
import Progress from '#models/progress'

export default class PostStats {
  static async getTotalPublished() {
    return Post.query()
      .apply((scope) => scope.published())
      .getCount()
  }

  static async getMonthlyPublished(
    startDate: DateTime<true> = DateTime.now().minus({ year: 1 }).startOf('month')
  ) {
    const query = db
      .from('posts')
      .where('state_id', States.PUBLIC)
      .where('publish_at', '<=', DateTime.now().toSQL())

    return GetMonthly.count(query, { startDate, monthlyColumn: 'publish_at' })
  }

  static async getTotalPostSeconds() {
    return Post.query()
      .apply((scope) => scope.published())
      .getSum('video_seconds')
  }

  static async getLessonsUsersHaveCompleted() {
    return Progress.query().where('isCompleted', true).getCount()
  }

  static async getMonthlyLessonsUsersHaveCompleted(
    startDate: DateTime<true> = DateTime.now().minus({ year: 1 }).startOf('month')
  ) {
    const query = db.from('progresses').where('is_completed', true)

    return GetMonthly.count(query, {
      startDate,
      monthlyColumn: 'updated_at',
    })
  }

  static async getLessonsWatchDuration() {
    return Progress.query().getSum('watch_seconds')
  }

  static async getMonthlyLessonsWatchDuration(
    startDate: DateTime<true> = DateTime.now().minus({ year: 1 }).startOf('month')
  ) {
    return GetMonthly.sum(db.from('progresses'), {
      startDate,
      monthlyColumn: 'updated_at',
      aggregateColumn: 'watch_seconds',
    })
  }
}
