import { HttpStatus, HttpException } from '@nestjs/common'

export class UnauthorizedError extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED)
  }
}

export class UserLoginALreadyExistsError extends HttpException {
  constructor() {
    super('Login already used', HttpStatus.CONFLICT)
  }
}
