import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelNameAlreadyExistsError extends HttpException {
  constructor() {
    super('Model name already exists', HttpStatus.CONFLICT)
  }
}
