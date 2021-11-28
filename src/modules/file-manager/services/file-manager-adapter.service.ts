import { FileManagementAdapter } from '../interfaces/file-manager.adapter'
import { UploadFileDto } from '../dtos/upload-file.dto'
import { Injectable } from '@nestjs/common'
import { S3FileUploadService } from './s3-file-upload.service'

@Injectable()
export class FileManagerAdapterService implements FileManagementAdapter {
  constructor(private readonly s3FileUploadService: S3FileUploadService) {}

  public async upload(uploadFileDto: UploadFileDto): Promise<string> {
    return this.s3FileUploadService.upload(uploadFileDto)
  }
}
