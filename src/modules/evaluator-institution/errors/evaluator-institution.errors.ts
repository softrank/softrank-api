import { HttpException, HttpStatus } from '@nestjs/common'

export class EvaluatorInstitutionNotFoundError extends HttpException {
  constructor() {
    super('Evaluator institution not found.', HttpStatus.NOT_FOUND)
  }
}

export class EvaluatorInstitutionAlreadyExistsError extends HttpException {
  constructor() {
    super('Evaluator institution already exists', HttpStatus.CONFLICT)
  }
}
