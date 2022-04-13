import { FileManagerAdapterService, S3FileUploadService } from './services'
import { Module } from '@nestjs/common'
import { fileManagerProviders } from './file-manager.providers'

@Module({
  providers: [FileManagerAdapterService, S3FileUploadService, ...fileManagerProviders],
  exports: [FileManagerAdapterService]
})
export class FileManagerModule {}
