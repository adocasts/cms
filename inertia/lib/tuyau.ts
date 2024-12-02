import { APP_DOMAIN } from './globals'
import { api } from '../../.adonisjs/api'
import { createTuyau } from '@tuyau/client'

export const tuyau = createTuyau({
  api,
  baseUrl: APP_DOMAIN,
})
