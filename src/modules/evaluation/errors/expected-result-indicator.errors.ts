import { HttpException, HttpStatus } from '@nestjs/common'

export class ExpectedResultIndicatorNotFoundError extends HttpException {
  constructor(message: string = 'Indicador de resultado esperado não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
