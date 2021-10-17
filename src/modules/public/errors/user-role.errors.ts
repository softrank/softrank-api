import { HttpException, HttpStatus } from '@nestjs/common'

export class UserRoleAlreadyExistsError extends HttpException {
  constructor() {
    super('User role already exists', HttpStatus.CONFLICT)
  }
}
