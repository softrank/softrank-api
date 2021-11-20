import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluationNotFoundError extends HttpException {
  constructor() {
    super('Evaluation not found', HttpStatus.NOT_FOUND)
  }
}
