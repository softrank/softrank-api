import { HttpStatus, HttpException } from '@nestjs/common'

export class CommonEntityAlreadyExistsError extends HttpException {
  constructor() {
    super('Common entity already exists', HttpStatus.CONFLICT)
  }
}
