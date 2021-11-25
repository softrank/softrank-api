import { HttpException, HttpStatus } from '@nestjs/common'

export class OrganizationalUnitProjectNotFoundError extends HttpException {
  constructor() {
    super('Organizational unit projoject not found.', HttpStatus.NOT_FOUND)
  }
}
