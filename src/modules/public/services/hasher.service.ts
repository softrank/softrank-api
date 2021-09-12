import { hashSync, compareSync } from 'bcrypt'

export class HasherService {
  public hash(value: string): string {
    return hashSync(value, 10)
  }

  public compare(attemptValue: string, hashedValue: string): boolean {
    return compareSync(attemptValue, hashedValue)
  }
}
