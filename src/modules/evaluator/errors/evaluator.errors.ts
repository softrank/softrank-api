import { HttpStatus, HttpException } from '@nestjs/common'

export class EvaluatorLicenseAlreadyExistsError extends HttpException {
  constructor() {
    super('Evaluator license already exists', HttpStatus.CONFLICT)
  }
}

export class EvaluatorLicenseNotFoundError extends HttpException {
  constructor() {
    super('Evaluator license not found', HttpStatus.NOT_FOUND)
  }
}

export class EvaluatorNotFoundError extends HttpException {
  constructor() {
    super('Evaluator not found', HttpStatus.NOT_FOUND)
  }
}
