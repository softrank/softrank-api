import { EvaluatorLicenseDto } from '@modules/shared/dtos/evaluator'
import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { Evaluator } from '@modules/evaluator/entities'

export class EvaluatorDto {
  id: string
  name: string
  status: EntityStatusEnum
  email: string
  documentNumber: string
  documentType: DocumentTypeEnum
  phone: string
  licenses: EvaluatorLicenseDto[]

  static fromEntity(evaluator: Evaluator): EvaluatorDto {
    const dto = new EvaluatorDto()

    dto.id = evaluator.id
    dto.status = evaluator.status
    dto.name = evaluator.commonEntity.name
    dto.email = evaluator.commonEntity.email
    dto.phone = evaluator.commonEntity.phone
    dto.documentNumber = evaluator.commonEntity.documentNumber
    dto.documentType = evaluator.commonEntity.documentType
    dto.licenses = evaluator.licenses.map(EvaluatorLicenseDto.fromEntity)

    return dto
  }
}
