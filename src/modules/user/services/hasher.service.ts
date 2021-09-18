import { hashSync, compareSync } from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HasherService {
  hash(value: string): string {
    return hashSync(value, 10)
  }

  compare(value: string, encryptedValue: string = ''): boolean {
    return compareSync(value, encryptedValue)
  }
}
