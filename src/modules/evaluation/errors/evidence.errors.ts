import { HttpException, HttpStatus } from '@nestjs/common'

export class EvidenceSourceNotFoundError extends HttpException {
  constructor(message: string = 'Evidence source not found.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
export class EvidenceSourceFileNotFoundError extends HttpException {
  constructor(message: string = 'Evidence source file not found.') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
