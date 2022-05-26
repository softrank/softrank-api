import { HttpException, HttpStatus } from '@nestjs/common'

export class IndicatorNotFoundError extends HttpException {
  constructor(message: string = 'Indicator not found.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
