import NotAllowedException from '#exceptions/not_allowed_exception'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class LoginController {
  async show({ inertia, response }: HttpContext) {
    if (app.inProduction) {
      return response.redirect('https://adocasts.com/login?return=cms')
    }

    return inertia.render('auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    if (app.inProduction) {
      throw new NotAllowedException(
        'Please use the official Adocasts site to login. Authentication is disabled directly via the Adocasts CMS.'
      )
    }

    const data = await request.validateUsing(loginValidator)
    const user = await User.login(auth, data)
    const baseMessage = 'Welcome back'

    session.flash('success', `${baseMessage}, ${user.username}`)

    return response.redirect().toPath('/')
  }
}
