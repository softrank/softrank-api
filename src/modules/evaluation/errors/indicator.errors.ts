import { HttpException, HttpStatus } from '@nestjs/common'

export class IndicatorNotFoundError extends HttpException {
  constructor() {
    super('Indicator not found.', HttpStatus.NOT_FOUND)
  }
}
