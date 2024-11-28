import GetPaginatedPosts from '#actions/posts/get_paginated_posts'
import PostDto from '#dtos/post'
import { postIndexValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia }: HttpContext) {
    const data = await request.validateUsing(postIndexValidator)

    const paginator = await GetPaginatedPosts.handle({
      page: request.input('page', 1),
      data,
    })

    paginator.baseUrl(router.makeUrl('posts.index'))
    paginator.queryString(request.qs())

    return inertia.render('posts/index', {
      postTypeId: data.postTypeId,
      posts: PostDto.fromPaginator(paginator, {
        start: paginator.firstPage,
        end: paginator.lastPage,
      }),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}