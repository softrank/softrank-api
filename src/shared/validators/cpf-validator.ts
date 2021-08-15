import { CleanNonNumbers } from '@utils/helpers'
import { cpf } from 'cpf-cnpj-validator'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({
  async: false
})
export class CpfValidator implements ValidatorConstraintInterface {
  validate(input: string): boolean {
    const cleanedInput = CleanNonNumbers(input)
    return cpf.isValid(cleanedInput)
  }

  defaultMessage(): string {
    return 'Número de CPF inválido'
  }
}
