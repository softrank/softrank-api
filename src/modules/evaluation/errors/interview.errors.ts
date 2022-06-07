import { HttpException, HttpStatus } from '@nestjs/common'

export class InterviewNotFoundError extends HttpException {
  constructor(message: string = 'Entrevista não encontrada.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
