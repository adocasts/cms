import GetPaginatedCollections from '#actions/collections/get_paginated_collections'
import StoreCollection from '#actions/collections/store_collection'
import StubCollection from '#actions/collections/stub_collection'
import UpdateCollection from '#actions/collections/update_collection'
import CollectionDto from '#dtos/collection'
import TaxonomyDto from '#dtos/taxonomy'
import Collection from '#models/collection'
import Taxonomy from '#models/taxonomy'
import {
  collectionIndexValidator,
  collectionStubValidator,
  collectionValidator,
} from '#validators/collection'
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
  async create({ inertia }: HttpContext) {
    const taxonomies = await Taxonomy.query().orderBy('name')

    return inertia.render('collections/form', {
      taxonomies: TaxonomyDto.fromArray(taxonomies),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(collectionValidator)
    const collection = await StoreCollection.handle({
      user: auth.user!,
      data,
    })

    return response.redirect().toRoute('collections.edit', { id: collection.id })
  }

  /**
   * Stub an empty child collection
   */
  async stub({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(collectionStubValidator)

    await StubCollection.handle({
      user: auth.user!,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia }: HttpContext) {
    const collection = await Collection.findOrFail(params.id)
    const taxonomies = await Taxonomy.query().orderBy('name')

    await collection.load('asset')
    await collection.load('taxonomies', (q) => q.select('id'))

    return inertia.render('collections/form', {
      collection: new CollectionDto(collection),
      taxonomies: TaxonomyDto.fromArray(taxonomies),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(collectionValidator, { meta: { id: params.id } })

    await UpdateCollection.handle({
      id: params.id,
      data,
    })

    return response.redirect().toRoute('collections.index')
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
