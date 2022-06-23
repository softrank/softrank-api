import { HttpStatus, HttpException } from '@nestjs/common'

export class ModelNotFoundError extends HttpException {
  constructor(message: string = 'Modelo não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
