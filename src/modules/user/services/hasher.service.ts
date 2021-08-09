import { Injectable } from '@nestjs/common'
import { hashSync, compareSync } from 'bcrypt'

@Injectable()
export class HasherService {
  hash(value: string): string {
    return hashSync(value, 10)
  }

  compare(value: string, encryptedValue: string): boolean {
    return compareSync(value, encryptedValue)
  }
}
