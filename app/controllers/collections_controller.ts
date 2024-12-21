import DestroyCollection from '#actions/collections/destroy_collection'
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
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('viewList')

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
  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('create')

    const taxonomies = await Taxonomy.query().orderBy('name')

    return inertia.render('collections/form', {
      taxonomies: TaxonomyDto.fromArray(taxonomies),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, session, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('create')

    const data = await request.validateUsing(collectionValidator)
    const collection = await StoreCollection.handle({
      user: auth.user!,
      data,
    })

    session.flash(
      'success',
      'Collection created successfully, you can now add content to this collection'
    )

    return response.redirect().toRoute('collections.edit.content', { id: collection.id })
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('update')

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
  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CollectionPolicy').authorize('update')

    const data = await request.validateUsing(collectionValidator, { meta: { id: params.id } })

    await UpdateCollection.handle({
      id: params.id,
      data,
    })

    session.flash('success', 'Collection updated successfully')

    return response.redirect().toRoute('collections.index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session, bouncer }: HttpContext) {
    const collection = await Collection.findOrFail(params.id)

    await bouncer.with('CollectionPolicy').authorize('destroy', collection)

    await DestroyCollection.handle(collection)

    session.flash('success', 'Collection deleted successfully')

    return response.redirect().toRoute('collections.index')
  }
}
