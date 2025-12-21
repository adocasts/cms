import axios from 'axios'

class R2Service {
  #api = axios.create({
    baseURL: 'https://vid.adocasts.com',
    headers: {
      Referer: 'https://adocasts.com',
    },
  })

  async getTranscript(videoId: string, filename = 'en.srt') {
    const { data } = await this.#api.get(`/${videoId}/${filename}`)
    return data as string
  }
}

const r2Service = new R2Service()

export default r2Service
