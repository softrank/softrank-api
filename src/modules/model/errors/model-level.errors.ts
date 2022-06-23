import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelLevelNotFoundError extends HttpException {
  constructor(message: string = 'Model level not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class ModelLevelAlreadyExistsError extends HttpException {
  constructor() {
    super('Model level already exists', HttpStatus.CONFLICT)
  }
}
