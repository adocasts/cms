import GetPaginatedCollections from '#actions/collections/get_paginated_collections'
import CollectionDto from '#dtos/collection'
import { collectionIndexValidator } from '#validators/collection'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class CollectionsController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia }: HttpContext) {
    const data = await request.validateUsing(collectionIndexValidator)
    const paginator = await GetPaginatedCollections.handle(data)

    paginator.baseUrl(router.makeUrl('collections.index'))
    paginator.queryString(request.qs())

    return inertia.render('collections/index', {
      collectionTypeId: data.collectionTypeId,
      term: data.term,
      collections: CollectionDto.fromPaginator(paginator, {
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
