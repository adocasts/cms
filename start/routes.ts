/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')

// ignore formatting, easier to visually scan single-line routes
/* prettier-ignore-start */
/* eslint-disable */

//* AUTH -> LOGIN, LOGOUT
router.get('/login', [LoginController, 'show']).as('auth.login.show').use(middleware.guest())
router.post('/login', [LoginController, 'store']).as('auth.login.store').use([middleware.guest()])
router.post('/logout', [LogoutController, 'handle']).as('auth.logout').use(middleware.auth())

router.group(() => {

  router.on('/').renderInertia('home')

}).middleware([middleware.auth()])