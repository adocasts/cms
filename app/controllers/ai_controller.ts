import aiService from '#services/ai/ai_service'
import r2Service from '#services/r2_service'
import { aiBodyOverviewValidator } from '#validators/ai'
import cache from '@adonisjs/cache/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class AiController {
  async videoChapters({ params }: HttpContext) {
    const transcript = await r2Service.getTranscript(params.videoId)
    const chapters = await aiService.generateChapters(transcript)
    return chapters
  }

  async bodyOverview({ request, params }: HttpContext) {
    const { body } = await request.validateUsing(aiBodyOverviewValidator)
    const force = request.input('force', false)
    const key = `lesson_${params.lessonId}`

    if (force) {
      await cache.namespace('AI_BODY_OVERVIEW').delete({ key })
    }

    const overview = await aiService.getOrGenerateBodyOverview(params.lessonId, body)

    return overview
  }
}
