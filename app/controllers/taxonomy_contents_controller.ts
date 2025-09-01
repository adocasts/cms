import SyncTaxonomyContent from '#actions/taxonomies/sync_taxonomy_content'
import PostDto from '#dtos/post'
import TaxonomyDto from '#dtos/taxonomy'
import Taxonomy from '#models/taxonomy'
import { taxonomyContentValidator } from '#validators/taxonomy'
import type { HttpContext } from '@adonisjs/core/http'

export default class TaxonomyContentsController {
  async edit({ params, inertia, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)

    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    const content = await taxonomy
      .related('posts')
      .query()
      .select('id', 'title', 'slug', 'publishAt', 'createdAt', 'updatedAt')
      .orderBy('publishAt', 'desc')

    return inertia.render('taxonomies/content', {
      taxonomy: new TaxonomyDto(taxonomy),
      posts: PostDto.fromArray(content),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)

    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    const data = await request.validateUsing(taxonomyContentValidator)

    await SyncTaxonomyContent.handle({ taxonomy, data })

    session.flash('success', 'Taxonomy content updated successfully')

    return response.redirect().back()
  }
}
