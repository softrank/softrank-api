import { HttpException, HttpStatus } from '@nestjs/common'

export class ExpectedResultNotFoundError extends HttpException {
  constructor(message: string = 'Expected result not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class ExpectedResultAlreadyExistsError extends HttpException {
  constructor(message: string = 'Expected result already exists') {
    super(message, HttpStatus.CONFLICT)
  }
}
