import { HttpStatus, HttpException } from '@nestjs/common'

export class UserAlreadyExistsError extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT)
  }
}

export class UserUnauthorizedError extends HttpException {
  constructor() {
    super('User unauthorized', HttpStatus.UNAUTHORIZED)
  }
}

export class UserNotFoundError extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND)
  }
}
