import { ParseUUIDPipe } from '@nestjs/common'

export const uuidParamValidation = () => {
  return new ParseUUIDPipe({ version: '4' })
}
