import HttpStatus from '#enums/http_statuses'
import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestException extends Exception {
  constructor(message: string = 'Bad request.') {
    super(message, { status: HttpStatus.BAD_REQUEST, code: 'E_BAD_REQUEST' })
  }
}
