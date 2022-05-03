import { ParseUUIDPipe } from '@nestjs/common'

type UuidVersions = '3' | '4' | '5'

export const uuidParamValidation = (version: UuidVersions = '4') => {
  return new ParseUUIDPipe({ version })
}
