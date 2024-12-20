import GetTaxonomies from '#actions/taxonomies/get_taxonomies'
import TaxonomyDto from '#dtos/taxonomy'
import Taxonomy from '#models/taxonomy'
import { taxonomyIndexValidator } from '#validators/taxonomy'
import type { HttpContext } from '@adonisjs/core/http'

export default class TaxonomiesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
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
