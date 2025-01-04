import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import GetMonthly, { MonthlyStat } from './get_monthly.js'

export default class UserStats {
  static async getTotal() {
    return User.query().getCount()
  }

  static async getMonthlyRegistrations(
    startDate: DateTime<true> = DateTime.now().minus({ year: 1 }).startOf('month')
  ) {
    return GetMonthly.count(db.from('users'), { startDate })
  }
}
