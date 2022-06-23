import { HttpException, HttpStatus } from '@nestjs/common'

export class ModelCapacityIndicatorNotFoundError extends HttpException {
  constructor(message: string = 'Indicador de capacidade de modelo não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
