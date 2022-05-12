import { EvaluatorInstitutionAddressDto } from '@modules/shared/dtos/evaluator-institution'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { LoginResponseDto } from '@modules/public/dtos'

export class EvaluatorInstitutionDto {
  id: string
  name: string
  status: EntityStatusEnum
  email: string
  documentNumber: string
  documentType: DocumentTypeEnum
  phone: string
  address: EvaluatorInstitutionAddressDto
  authorization: LoginResponseDto

  static fromEntity(evaluatorInstitution: EvaluatorInstitution, authorization?: LoginResponseDto): EvaluatorInstitutionDto {
    const evaluatorInstitutionDto = new EvaluatorInstitutionDto()

    evaluatorInstitutionDto.id = evaluatorInstitution.id
    evaluatorInstitutionDto.status = evaluatorInstitution.status
    evaluatorInstitutionDto.name = evaluatorInstitution.commonEntity.name
    evaluatorInstitutionDto.phone = evaluatorInstitution.commonEntity.phone
    evaluatorInstitutionDto.email = evaluatorInstitution.commonEntity.email
    evaluatorInstitutionDto.documentType = evaluatorInstitution.commonEntity.documentType
    evaluatorInstitutionDto.documentNumber = evaluatorInstitution.commonEntity.documentNumber
    evaluatorInstitutionDto.address = EvaluatorInstitutionAddressDto.fromEntity(evaluatorInstitution.address)
    evaluatorInstitutionDto.authorization = authorization

    return evaluatorInstitutionDto
  }
}
