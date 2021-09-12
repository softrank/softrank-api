import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { cpf, cnpj } from 'cpf-cnpj-validator'

interface CustomValidationArguments extends ValidationArguments {
  object: {
    documentType: DocumentTypeEnum
  }
}

export class DocumentNumberValidator implements ValidatorConstraintInterface {
  validate(value: string, { object }: CustomValidationArguments): boolean {
    if (!object.documentType || object.documentType === DocumentTypeEnum.F) {
      return cpf.isValid(value)
    }
    return cnpj.isValid(value)
  }
}
