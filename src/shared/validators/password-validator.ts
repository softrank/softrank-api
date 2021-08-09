import { ValidatorConstraintInterface } from 'class-validator'
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(input: string): boolean {
    return input?.length >= 6
  }
}
