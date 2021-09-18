import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelNotFoundError extends HttpException {
  constructor() {
    super('Model not found', HttpStatus.NOT_FOUND)
  }
}
