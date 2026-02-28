import { Chapter } from '#dtos/post_form'
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
}

const aiService = new AiService()
export default aiService
