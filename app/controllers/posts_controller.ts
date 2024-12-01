import GetPaginatedPosts from '#actions/posts/get_paginated_posts'
import GetPost from '#actions/posts/get_post'
import StorePost from '#actions/posts/store_post'
import GetTaxonomyTree from '#actions/taxonomies/get_taxonomy_tree'
import PostDto from '#dtos/post'
import PostFormDto from '#dtos/post_form'
import TaxonomyDto from '#dtos/taxonomy'
import Taxonomy from '#models/taxonomy'
import { postIndexValidator, postValidator } from '#validators/post'
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
  async create({ inertia }: HttpContext) {
    const taxonomies = await Taxonomy.query().orderBy('name')

    return inertia.render('posts/form', {
      taxonomies: TaxonomyDto.fromArray(taxonomies),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(postValidator)

    await StorePost.handle({
      author: auth.user!,
      data,
    })

    return response.redirect().toRoute('posts.index')
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia }: HttpContext) {
    const post = await GetPost.byId(params.id)
    const taxonomies = await Taxonomy.query().orderBy('name')

    return inertia.render('posts/form', {
      post: new PostFormDto(post),
      taxonomies: TaxonomyDto.fromArray(taxonomies),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
