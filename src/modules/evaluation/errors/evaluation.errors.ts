import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluationNotFoundError extends HttpException {
  constructor(message: string = 'Avaliação não encontrada.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class EvaluatorCantBeChooseError extends HttpException {
  constructor(message: string = 'Evaluator can not be choose') {
    super(message, HttpStatus.CONFLICT)
  }
}

export class UserIsNotAllowedToAccessThisEvaluationError extends HttpException {
  constructor(message: string = 'Evaluator can not be choose') {
    super(message, HttpStatus.FORBIDDEN)
  }
}

export class EvaluationCanNotChangeStatusError extends HttpException {
  constructor(message: string = 'Evaluation can not change status.') {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export class EvaluationProjectNotFoundError extends HttpException {
  constructor(message: string = 'Projeto da avaliação não encontrado.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
