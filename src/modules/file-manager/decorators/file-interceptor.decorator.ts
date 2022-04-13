import { FileInterceptor } from '@nestjs/platform-express'
import { MB } from '@utils/helpers'

export const buildImageFileInterceptor = (field: string) =>
  FileInterceptor(field, {
    limits: { fileSize: MB(1) }
  })
