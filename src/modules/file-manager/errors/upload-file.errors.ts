import { HttpException, HttpStatus } from '@nestjs/common'

export class S3UploadFileError extends HttpException {
  constructor() {
    super("Can't upload file to s3", HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
