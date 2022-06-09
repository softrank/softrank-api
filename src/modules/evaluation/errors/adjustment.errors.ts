import { HttpException, HttpStatus } from '@nestjs/common'

export class AdjustmentNotFoundError extends HttpException {
  constructor(message: string = 'Melhoria não encontrada') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
