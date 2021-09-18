import { HttpException, HttpStatus } from '@nestjs/common'

export class ModelProcessNotFoundError extends HttpException {
  constructor() {
    super('Model process not found.', HttpStatus.NOT_FOUND)
  }
}

export class ModelProcessAlreadyExistsError extends HttpException {
  constructor() {
    super('Model process already exists.', HttpStatus.CONFLICT)
  }
}
