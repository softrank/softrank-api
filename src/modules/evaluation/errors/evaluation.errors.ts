import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluationNotFoundError extends HttpException {
  constructor() {
    super('Evaluation not found', HttpStatus.NOT_FOUND)
  }
}

export class EvaluatorCantBeChooseError extends HttpException {
  constructor() {
    super('Evaluator can not be choose', HttpStatus.CONFLICT)
  }
}
