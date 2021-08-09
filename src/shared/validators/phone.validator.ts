import { CleanNonNumbers } from '@utils/helpers'
import {
  ValidatorConstraintInterface,
  ValidatorConstraint
} from 'class-validator'

@ValidatorConstraint({
  async: false
})
export class PhoneValidator implements ValidatorConstraintInterface {
  validate(input: string): boolean {
    const cleanedInput = CleanNonNumbers(input)
    return cleanedInput?.length === 10 || cleanedInput?.length === 11
  }

  defaultMessage(): string {
    return 'Número de telefone ou celular inválido'
  }
}
