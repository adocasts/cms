import aiSearch from '#services/ai_search_service'
import r2Service from '#services/r2_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class AiVideosController {
  async chapters({ params }: HttpContext) {
    const transcript = await r2Service.getTranscript(params.videoId)
    const chapters = await aiSearch.chapters(transcript)

    return chapters
  }
}
