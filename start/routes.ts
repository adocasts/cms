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
const AssetsController = () => import('#controllers/assets_controller')
const PostsController = () => import('#controllers/posts_controller')

const DashboardController = () => import('#controllers/dashboard_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')

// ignore formatting, easier to visually scan single-line routes
/* prettier-ignore-start */
/* eslint-disable */

router.where('id', router.matchers.number())

//* AUTH -> LOGIN, LOGOUT
router.get('/login', [LoginController, 'show']).as('auth.login.show').use(middleware.guest())
router.post('/login', [LoginController, 'store']).as('auth.login.store').use([middleware.guest()])
router.post('/logout', [LogoutController, 'handle']).as('auth.logout').use(middleware.auth())

router.group(() => {

  router.get('/', [DashboardController]).as('dashboard')

  //* ASSETS
  router.get('/assets', [AssetsController, 'show'])
  router.get('/assets/*', [AssetsController, 'show']).as('assets.show')
  router.post('/assets/:typeId?', [AssetsController, 'store']).as('assets.store').where('typeId', router.matchers.number())
  router.delete('/assets/:id', [AssetsController, 'destroy']).as('assets.destroy')

  //* POSTS
  router.get('/posts', [PostsController, 'index']).as('posts.index')
  router.get('/posts/create', [PostsController, 'create']).as('posts.create')
  router.get('/posts/:id', [PostsController, 'show']).as('posts.show')
  router.get('/posts/:slug', [PostsController, 'show']).as('posts.slug')
  router.post('/posts', [PostsController, 'store']).as('posts.store')
  router.put('/posts/:id', [PostsController, 'update']).as('posts.update')
  router.delete('/posts/:id', [PostsController, 'destroy']).as('posts.destroy')

}).middleware([middleware.auth()])