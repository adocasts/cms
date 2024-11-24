import edge from 'edge.js'
import env from './env.js'

edge.global('APP_DOMAIN', env.get('APP_DOMAIN'))
