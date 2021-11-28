import { ApiConsumes, ApiBody } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function SwaggerUploadFileDecorator(field = 'file') {
  const decorators = [
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [field]: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    })
  ]

  return applyDecorators(...decorators)
}
