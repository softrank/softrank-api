import { HttpException, HttpStatus } from '@nestjs/common'

export class ModelCapacityNotFound extends HttpException {
  constructor(message: string = 'Modelo de capacidade não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
