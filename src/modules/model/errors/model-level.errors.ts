import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelLevelNotFoundError extends HttpException {
  constructor(message: string = 'Nível de modelo não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class ModelLevelAlreadyExistsError extends HttpException {
  constructor() {
    super('Model level already exists', HttpStatus.CONFLICT)
  }
}
