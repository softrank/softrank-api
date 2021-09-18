import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelLevelNotFoundError extends HttpException {
  constructor() {
    super('Model level not found', HttpStatus.NOT_FOUND)
  }
}

export class ModelLevelAlreadyExistsError extends HttpException {
  constructor() {
    super('Model level already exists', HttpStatus.CONFLICT)
  }
}
