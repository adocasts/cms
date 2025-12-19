import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import axios, { AxiosInstance } from 'axios'

class AiSearchService {
  #accountId = env.get('CLOUDFLARE_ACCOUNT_ID')
  #token = env.get('AI_SEARCH_KEY')
  #api: AxiosInstance

  constructor() {
    if (!this.#accountId || !this.#token) {
      throw new Exception('Cloudflare account id or AI Search token is missing.')
    }

    this.#api = axios.create({
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${this.#accountId}/autorag/rags/adocasts-rag/ai-search`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#token}`,
      },
    })
  }

  async chapters(captions: string) {
    const { data } = await this.#api.post('', {
      query: `Take the provided SRT subtitles and create as few as possible, high-level, timestamp chapters from them. Between 3 to 8 chapters. The chapters time should only consist of minutes and seconds unless the captions go over an hour. Response should only contain JavaScript parsable JSON in the structure: [{ start: 'mm:ss', end: 'mm:ss', text: 'chapter text' }]. Captions: ${captions}`,
    })

    return data
  }
}

const aiSearch = new AiSearchService()
export default aiSearch
