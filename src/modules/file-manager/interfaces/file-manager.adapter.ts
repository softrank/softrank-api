import { UploadFileDto } from '../dtos/upload-file.dto'

export interface FileManagementAdapter {
  upload(param: UploadFileDto): Promise<string>
}
