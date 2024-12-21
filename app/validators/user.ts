import vine from '@vinejs/vine'
import { exists } from './helpers/db.js'

export const userIndexValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    term: vine.string().optional(),
    roleId: vine.number().exists(exists('roles', 'id')).optional(),
  })
)

export const userRoleValidator = vine.compile(
  vine.object({
    roleId: vine.number().exists(exists('roles', 'id')),
  })
)
