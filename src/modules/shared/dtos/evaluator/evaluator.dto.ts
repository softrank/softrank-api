import { EvaluatorLicenseDto } from '@modules/shared/dtos/evaluator'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { Evaluator } from '@modules/evaluator/entities'

export class EvaluatorDto {
  id: string
  name: string
  email: string
  documentNumber: string
  documentType: DocumentTypeEnum
  phone: string
  licenses: EvaluatorLicenseDto[]

  static fromEntity(evaluator: Evaluator): EvaluatorDto {
    const dto = new EvaluatorDto()

    dto.id = evaluator.id
    dto.name = evaluator.commonEntity.name
    dto.email = evaluator.commonEntity.email
    dto.phone = evaluator.commonEntity.phone
    dto.documentNumber = evaluator.commonEntity.documentNumber
    dto.documentType = evaluator.commonEntity.documentType
    dto.licenses = evaluator.licenses.map(EvaluatorLicenseDto.fromEntity)

    return dto
  }
}
