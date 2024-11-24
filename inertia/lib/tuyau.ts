import { APP_DOMAIN } from './globals'
import { api } from '../../.adonisjs/api'
import { createTuyau } from '@tuyau/client'

console.log({ api })

export const tuyau = createTuyau({
  api,
  baseUrl: APP_DOMAIN,
})
