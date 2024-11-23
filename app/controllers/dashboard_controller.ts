import type { HttpContext } from '@adonisjs/core/http'
import GetDashboardCounts from '../actions/dashboard/get_dashboard_counts.js'

export default class DashboardController {
  async handle({ inertia }: HttpContext) {
    const counts = await GetDashboardCounts.handle()

    return inertia.render('dashboard', {
      counts,
    })
  }
}
