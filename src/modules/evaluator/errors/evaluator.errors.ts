import { HttpStatus, HttpException } from '@nestjs/common'

export class EvaluatorLicenseAlreadyExistsError extends HttpException {
  constructor() {
    super('Evaluator license already exists', HttpStatus.CONFLICT)
  }
}
