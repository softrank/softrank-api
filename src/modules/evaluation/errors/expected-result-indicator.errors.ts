import { HttpException, HttpStatus } from '@nestjs/common'

export class ExpectedResultIndicatorNotFoundError extends HttpException {
  constructor() {
    super('Expected result not found.', HttpStatus.NOT_FOUND)
  }
}
