import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { UploadFileDto } from '../dtos/upload-file.dto'
import { v4 } from 'uuid'
import { aws } from '../../../config/env'
import { Inject } from '@nestjs/common'
import { FileManagerProvidersEnum } from '../enums/file-manager-providers.enum'
import { S3UploadFileError } from '../errors'

export class S3FileUploadService {
  constructor(@Inject(FileManagerProvidersEnum.S3) private readonly s3: S3) {}

  public async upload(uploadFileDto: UploadFileDto): Promise<string> {
    try {
      const uploadParams = this.buildUploadParams(uploadFileDto)
      const s3Response = await this.s3.upload(uploadParams).promise()
      const url = s3Response.Location
      return url
    } catch (error) {
      throw new S3UploadFileError()
    }
  }

  private buildUploadParams(uploadFileDto: UploadFileDto): PutObjectRequest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, extension] = uploadFileDto.mimetype.split('/')
    return {
      Bucket: aws.s3.bucket,
      Key: `${aws.s3.baseFolder}/${uploadFileDto.folder}/${v4()}.${extension}`,
      ContentType: uploadFileDto.mimetype,
      Body: uploadFileDto.buffer,
      ACL: 'public-read'
    }
  }
}
