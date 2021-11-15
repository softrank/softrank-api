import { HttpException, HttpStatus } from '@nestjs/common'

export class OrganizationalUnitAlreadyExist extends HttpException {
  constructor() {
    super('Organizational unit already exist', HttpStatus.CONFLICT)
  }
}

export class OrganizationalUnitNotFound extends HttpException {
  constructor() {
    super('Organizational unit not found.', HttpStatus.NOT_FOUND)
  }
}
