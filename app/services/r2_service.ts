import axios from 'axios'

class R2Service {
  #api = axios.create({
    baseURL: 'https://vid.adocasts.com',
    headers: {
      Referer: 'https://adocasts.com',
    },
  })

  async getTranscript(videoId: string) {
    const { data } = await this.#api.get(`/${videoId}/en.srt`)
    return data as string
  }
}

const r2Service = new R2Service()

export default r2Service
