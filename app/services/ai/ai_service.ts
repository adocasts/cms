import { Chapter } from '#dtos/post_form'
import cache from '@adonisjs/cache/services/main'
import { google } from '@ai-sdk/google'
import { generateText, Output } from 'ai'
import { z } from 'zod'

class AiService {
  private model = google('gemini-2.5-flash-lite')

  async generateChapters(captions: string): Promise<Chapter[]> {
    const { output } = await generateText({
      model: this.model,
      output: Output.object({
        schema: z.object({
          chapters: z.array(
            z.object({
              // Adding a regex to the schema helps guide the generation
              start: z.string().describe('Timestamp in mm:ss or hh:mm:ss (no milliseconds)'),
              end: z.string().describe('Timestamp in mm:ss or hh:mm:ss (no milliseconds)'),
              text: z.string().describe('A concise, high-level chapter title'),
            })
          ),
        }),
      }),
      prompt: `
        Analyze the following SRT subtitles and create 2 to 10 high-level chapters.
        
        ### Formatting Rules:
        - Use ONLY mm:ss (e.g., 05:22) or hh:mm:ss (e.g., 1:02:15) if over an hour.
        - DO NOT include milliseconds or commas (e.g., no "00:00:10,600").
        - Always round to the nearest second.

        ### Example Output:
        - 00:00 - Introduction
        - 04:12 - Deep Dive into Logic
        - 12:45 - Final Summary

        Captions:
        ${captions}
      `,
    })

    return output.chapters
  }

  async getBodyOverview(lessonId: number) {
    return cache.namespace('AI_BODY_OVERVIEW').get({ key: `lesson_${lessonId}` })
  }

  async getOrGenerateBodyOverview(lessonId: number, body: string) {
    return cache.namespace('AI_BODY_OVERVIEW').getOrSet({
      key: `lesson_${lessonId}`,
      ttl: '180d',
      factory: async () => this.generateBodyOverview(body),
    })
  }

  async generateBodyOverview(body: string): Promise<AiBodyOverview> {
    const { output } = await generateText({
      model: this.model,
      output: Output.object({
        schema: z.object({
          summary: z
            .array(z.string())
            .describe('3 to 5 concise, action-oriented bullet points summarizing the lesson.'),
          metaDescription: z
            .string()
            .max(160)
            .describe(
              'A high-click-through SEO description. Must include the primary topic and a call to learning, under 160 characters.'
            ),
          socialHooks: z.object({
            twitter: z
              .string()
              .describe(
                'A punchy, curiosity-gap style tweet to drive clicks. Use 1-2 relevant hashtags.'
              ),
            facebook: z
              .string()
              .describe(
                'A conversational, community-focused post. Explain the value of the lesson and encourage comments or shares.'
              ),
          }),
        }),
      }),
      prompt: `Analyze the following lesson body and generate metadata: ${body}`,
    })

    return output
  }
}

export interface AiBodyOverview {
  summary: string[]
  metaDescription: string
  socialHooks: {
    twitter: string
    facebook: string
  }
}

const aiService = new AiService()
export default aiService
