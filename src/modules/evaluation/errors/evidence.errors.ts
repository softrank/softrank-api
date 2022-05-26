import { HttpException, HttpStatus } from '@nestjs/common'

export class EvidenceSourceNotFoundError extends HttpException {
  constructor(message: string = 'Evidence not found.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
