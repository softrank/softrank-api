import { HttpException, HttpStatus } from '@nestjs/common'

export class ExpectedResultNotFoundError extends HttpException {
  constructor() {
    super('Expected result not found', HttpStatus.NOT_FOUND)
  }
}

export class ExpectedResultAlreadyExistsError extends HttpException {
  constructor() {
    super('Expected result already exists', HttpStatus.CONFLICT)
  }
}
