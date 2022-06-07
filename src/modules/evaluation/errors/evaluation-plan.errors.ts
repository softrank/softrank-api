import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluationPlanNotFoundError extends HttpException {
  constructor(message: string = 'Plano de avaliação não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
