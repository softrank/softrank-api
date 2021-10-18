import { HttpException, HttpStatus } from '@nestjs/common'

export class AuditorNotFoundError extends HttpException {
  constructor() {
    super('Auditor not found.', HttpStatus.NOT_FOUND)
  }
}

export class AuditorAlreadyExists extends HttpException {
  constructor() {
    super('Auditor already exists.', HttpStatus.CONFLICT)
  }
}
