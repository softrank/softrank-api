import { sign, decode as decodeJwt } from 'jsonwebtoken'
import { api } from '@config/env'

export class EncrypterService {
  public encrypt(payload: string): string {
    return sign({ id: payload }, api.secretKey, { expiresIn: '12h' })
  }

  public decode(value: string): any {
    return decodeJwt(value) as string
  }
}
