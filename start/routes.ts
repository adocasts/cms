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
const TaxonomyContentsController = () => import('#controllers/taxonomy_contents_controller')
const CouponsController = () => import('#controllers/coupons_controller')
const PlansController = () => import('#controllers/plans_controller')
const RolesController = () => import('#controllers/roles_controller')
const UsersController = () => import('#controllers/users_controller')
const TaxonomiesController = () => import('#controllers/taxonomies_controller')
const CollectionContentsController = () => import('#controllers/collection_contents_controller')
const CollectionsController = () => import('#controllers/collections_controller')
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
  router.get('/posts/search', [PostsController, 'search']).as('posts.search')
  router.get('/posts/create', [PostsController, 'create']).as('posts.create')
  router.get('/posts/:id/edit', [PostsController, 'edit']).as('posts.edit')
  router.post('/posts', [PostsController, 'store']).as('posts.store')
  router.put('/posts/:id', [PostsController, 'update']).as('posts.update')
  router.delete('/posts/:id', [PostsController, 'destroy']).as('posts.destroy')

  //* COLLECTIONS
  router.get('/collections', [CollectionsController, 'index']).as('collections.index')
  router.get('/collections/create', [CollectionsController, 'create']).as('collections.create')
  router.get('/collections/:id/edit', [CollectionsController, 'edit']).as('collections.edit')
  router.post('/collections', [CollectionsController, 'store']).as('collections.store')
  router.put('/collections/:id', [CollectionsController, 'update']).as('collections.update')
  router.delete('/collections/:id', [CollectionsController, 'destroy']).as('collections.destroy')

  //* COLLECTION CONTENT [Modules & Posts]
  router.get('/collections/:id/edit/content', [CollectionContentsController, 'edit']).as('collections.edit.content')
  router.put('/collections/:id/content', [CollectionContentsController, 'update']).as('collections.update.content')

  //* TAXONOMIES
  router.get('/taxonomies', [TaxonomiesController, 'index']).as('taxonomies.index')
  router.get('/taxonomies/create', [TaxonomiesController, 'create']).as('taxonomies.create')
  router.post('/taxonomies', [TaxonomiesController, 'store']).as('taxonomies.store')
  router.get('/taxonomies/:id/edit', [TaxonomiesController, 'edit']).as('taxonomies.edit')
  router.put('/taxonomies/:id', [TaxonomiesController, 'update']).as('taxonomies.update')
  router.delete('/taxonomies/:id', [TaxonomiesController, 'destroy']).as('taxonomies.destroy')

  //* TAXONOMY CONTENT [Posts]
  router.get('/taxonomies/:id/edit/content', [TaxonomyContentsController, 'edit']).as('taxonomies.edit.content')
  router.put('/taxonomies/:id/content', [TaxonomyContentsController, 'update']).as('taxonomies.update.content')

  //* USERS
  router.get('/users', [UsersController, 'index']).as('users.index')
  router.get('/users/:id', [UsersController, 'show']).as('users.show')
  router.patch('/users/:id/role', [UsersController, 'role']).as('users.update.role')
  router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

  //* ROLES
  router.get('/roles', [RolesController, 'index']).as('roles.index')
  router.get('/roles/create', [RolesController, 'create']).as('roles.create')
  router.post('/roles', [RolesController, 'store']).as('roles.store')
  router.get('/roles/:id/edit', [RolesController, 'edit']).as('roles.edit')
  router.put('/roles/:id', [RolesController, 'update']).as('roles.update')
  router.delete('/roles/:id', [RolesController, 'destroy']).as('roles.destroy')

  //* PLANS
  router.get('/plans', [PlansController, 'index']).as('plans.index')
  router.get('/plans/create', [PlansController, 'create']).as('plans.create')
  router.post('/plans', [PlansController, 'store']).as('plans.store')
  router.get('/plans/:id/edit', [PlansController, 'edit']).as('plans.edit')
  router.put('/plans/:id', [PlansController, 'update']).as('plans.update')
  router.patch('/plans/:id/activate', [PlansController, 'activate']).as('plans.activate')
  router.patch('/plans/:id/deactivate', [PlansController, 'deactivate']).as('plans.deactivate')
  router.delete('/plans/:id', [PlansController, 'destroy']).as('plans.destroy')

  //* COUPONS
  router.get('/coupons/create', [CouponsController, 'create']).as('coupons.create')
  router.post('/coupons', [CouponsController, 'run']).as('coupons.run')
  router.delete('/coupons', [CouponsController, 'clear']).as('coupons.clear')

}).middleware([middleware.auth()])