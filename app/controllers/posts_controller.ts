import DestroyPost from '#actions/posts/destroy_post'
import GetPaginatedPosts from '#actions/posts/get_paginated_posts'
import GetPost from '#actions/posts/get_post'
import SearchPosts from '#actions/posts/search_posts'
import StorePost from '#actions/posts/store_post'
import UpdatePost from '#actions/posts/update_post'
import AutocompleteDto from '#dtos/autocomplete'
import { CollectionPostFormDto } from '#dtos/collection_content_form'
import FrameworkVersionDto from '#dtos/framework_version'
import PostDto from '#dtos/post'
import PostFormDto from '#dtos/post_form'
import TaxonomyDto from '#dtos/taxonomy'
import FrameworkVersion from '#models/framework_version'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import { postIndexValidator, postSearchValidator, postValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewList')

    const data = await request.validateUsing(postIndexValidator)
    const paginator = await GetPaginatedPosts.handle(data)

    paginator.baseUrl(router.makeUrl('posts.index'))
    paginator.queryString(request.qs())

    return inertia.render('posts/index', {
      postTypeId: data.postTypeId,
      term: data.term,
      posts: PostDto.fromPaginator(paginator, {
        start: paginator.firstPage,
        end: paginator.lastPage,
      }),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')

    const taxonomies = await Taxonomy.query().orderBy('name')
    const frameworkVersions = await FrameworkVersion.query().orderBy('sort')

    return inertia.render('posts/form', {
      taxonomies: TaxonomyDto.fromArray(taxonomies),
      frameworkVersions: FrameworkVersionDto.fromArray(frameworkVersions),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')

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
  async edit({ params, inertia, bouncer }: HttpContext) {
    const post = await GetPost.byId(params.id)
    const taxonomies = await Taxonomy.query().orderBy('name')
    const frameworkVersions = await FrameworkVersion.query().orderBy('sort')

    await bouncer.with('PostPolicy').authorize('update', post)

    return inertia.render('posts/form', {
      post: new PostFormDto(post),
      taxonomies: TaxonomyDto.fromArray(taxonomies),
      frameworkVersions: FrameworkVersionDto.fromArray(frameworkVersions),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, bouncer }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('update', post)

    const data = await request.validateUsing(postValidator, { meta: { id: params.id } })

    await UpdatePost.handle(post, data)

    return response.redirect().toRoute('posts.index')
  }

  /**
   * Search posts by term
   */
  async search({ request, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewList')

    const data = await request.validateUsing(postSearchValidator)
    const posts = await SearchPosts.handle(data)

    return {
      options: AutocompleteDto.fromArray(posts),
      data: CollectionPostFormDto.fromArray(posts),
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session, bouncer }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('destroy', post)

    await DestroyPost.handle(post)

    session.flash('success', `Your post "${post.title}" has been deleted`)

    return response.redirect().toRoute('posts.index')
  }
}
