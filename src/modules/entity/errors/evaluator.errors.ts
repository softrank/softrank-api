import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluatorNotFoundError extends HttpException {
  constructor() {
    super('Evaluator not found', HttpStatus.NOT_FOUND)
  }
}

export class EvaluatorConflictError extends HttpException {
  constructor() {
    super('Evaluator already exists', HttpStatus.CONFLICT)
  }
}
