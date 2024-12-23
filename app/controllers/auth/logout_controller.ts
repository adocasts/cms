import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async handle({ auth, session, inertia }: HttpContext) {
    await User.logout(auth)

    session.flash('success', 'See you next time')

    return inertia.location('https://adocasts.com/signin?action=cms')
  }
}
