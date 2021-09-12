import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelLevelNotFoundError extends HttpException {
  constructor() {
    super('Model level not found', HttpStatus.NOT_FOUND)
  }
}
