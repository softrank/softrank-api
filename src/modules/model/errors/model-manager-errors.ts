import { HttpException, HttpStatus } from '@nestjs/common'

export class ModelManagerNotFoundError extends HttpException {
  constructor() {
    super('Model manager not found', HttpStatus.NOT_FOUND)
  }
}

export class ModelManagerAlreadyExistsError extends HttpException {
  constructor() {
    super('Model manager already exists', HttpStatus.CONFLICT)
  }
}
