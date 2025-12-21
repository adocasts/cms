import VideoTypes from '#enums/video_types'
import Post from '#models/post'
import CaptionService from '#services/caption_service'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import drive from '@adonisjs/drive/services/main'
import { DateTime } from 'luxon'

export default class SyncRagContent extends BaseCommand {
  static commandName = 'sync:rag-content'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const posts = await Post.query()
      .apply((scope) => scope.published())
      .where('videoTypeId', VideoTypes.R2)
      .whereNotNull('videoUrl')
      .where((query) => {
        query.whereNull('ragAddedAt').orWhereRaw('rag_added_at < updated_content_at')
      })

    for (const post of posts) {
      const videoText = await this.#getVideoText(post.videoId)
      const types: string[] = []

      if (videoText) {
        await drive.use('rag').put(`posts/${post.id}/captions.txt`, videoText)
        types.push('captions')
      }

      if (post.body) {
        await drive.use('rag').put(`posts/${post.id}/body.html`, post.body)
        types.push('body')
      }

      post.ragAddedAt = DateTime.now()

      await post.save()

      this.logger.info(`Post: ${post.id}; Added to RAG file types: ${types.join(', ')}`)
    }
  }

  async #getVideoText(videoId: string | null) {
    if (!videoId) return

    if (await drive.use('videos').exists(`${videoId}/en.srt`)) {
      const srt = await drive.use('videos').get(`${videoId}/en.srt`)
      const captions = CaptionService.parse(srt)
        .cues.filter((c) => c !== null)
        .map((c) => c.text)
        .join(' ')

      return captions
    }
  }
}
