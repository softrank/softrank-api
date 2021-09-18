import { sign, decode } from 'jsonwebtoken'
import { LoggedUser } from '@shared/types'
import { security } from '@config/env'
import { api } from '../../../config/env'

export class EncrypterService {
  encrypt(payload: string): string {
    return sign({ id: payload }, security.secretKey, {
      expiresIn: security.expiresIn
    })
  }

  decodeFn(value: string): LoggedUser {
    return decode(value, { json: true }) as LoggedUser
  }
}
