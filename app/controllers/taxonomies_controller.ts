import DestroyTaxonomy from '#actions/taxonomies/destroy_taxonomy'
import GetTaxonomies from '#actions/taxonomies/get_taxonomies'
import StoreTaxonomy from '#actions/taxonomies/store_taxonomy'
import UpdateTaxonomy from '#actions/taxonomies/update_taxonomy'
import TaxonomyDto from '#dtos/taxonomy'
import Taxonomy from '#models/taxonomy'
import {
  taxonomyCreateValidator,
  taxonomyIndexValidator,
  taxonomyValidator,
} from '#validators/taxonomy'
import type { HttpContext } from '@adonisjs/core/http'

export default class TaxonomiesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('TaxonomyPolicy').authorize('viewList')

    const data = await request.validateUsing(taxonomyIndexValidator)
    const taxonomies = await GetTaxonomies.handle(data)
    let parent: Taxonomy | null = null

    if (data.parentId) {
      parent = await Taxonomy.findOrFail(data.parentId)
    }

    return inertia.render('taxonomies/index', {
      taxonomies: TaxonomyDto.fromArray(taxonomies),
      parent: parent ? new TaxonomyDto(parent) : null,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('TaxonomyPolicy').authorize('create')

    const { parentId } = await request.validateUsing(taxonomyCreateValidator)
    const parent = parentId ? await Taxonomy.findOrFail(parentId) : null
    console.log({
      parentId,
      parent,
    })
    return inertia.render('taxonomies/form', {
      parent: parent ? new TaxonomyDto(parent) : null,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, session, bouncer }: HttpContext) {
    await bouncer.with('TaxonomyPolicy').authorize('create')

    const data = await request.validateUsing(taxonomyValidator)

    const taxonomy = await StoreTaxonomy.handle({
      user: auth.user!,
      data,
    })

    session.flash('success', 'Taxonomy created successfully')

    return response
      .redirect()
      .toRoute('taxonomies.index', {}, { qs: { parentId: taxonomy.parentId } })
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)
    const parent = await taxonomy.related('parent').query().first()

    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    return inertia.render('taxonomies/form', {
      taxonomy: new TaxonomyDto(taxonomy),
      parent: parent ? new TaxonomyDto(parent) : null,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)

    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    const data = await request.validateUsing(taxonomyValidator, { meta: { id: params.id } })

    await UpdateTaxonomy.handle(taxonomy, data)

    session.flash('success', 'Taxonomy updated successfully')

    return response
      .redirect()
      .toRoute('taxonomies.index', {}, { qs: { parentId: taxonomy.parentId } })
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)

    await bouncer.with('TaxonomyPolicy').authorize('destroy', taxonomy)

    await DestroyTaxonomy.handle(taxonomy)

    session.flash('success', 'Taxonomy deleted successfully')

    return response
      .redirect()
      .toRoute('taxonomies.index', {}, { qs: { parentId: taxonomy.parentId } })
  }
}
