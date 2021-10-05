import { EvaluatorInstitutionAddressDto } from '@modules/shared/dtos/evaluator-institution'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'

export class EvaluatorInstitutionDto {
  @ApiProperty()
  id: string

  @ApiProperty({ example: 'Lucas' })
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  documentNumber: string

  @ApiProperty()
  documentType: DocumentTypeEnum

  @ApiProperty()
  phone: string

  @ApiProperty({ type: () => EvaluatorInstitutionAddressDto })
  address: EvaluatorInstitutionAddressDto

  static fromEntity(evaluatorInstitution: EvaluatorInstitution): EvaluatorInstitutionDto {
    const evaluatorInstitutionDto = new EvaluatorInstitutionDto()

    evaluatorInstitutionDto.id = evaluatorInstitution.id
    evaluatorInstitutionDto.name = evaluatorInstitution.commonEntity.name
    evaluatorInstitutionDto.phone = evaluatorInstitution.commonEntity.phone
    evaluatorInstitutionDto.email = evaluatorInstitution.commonEntity.email
    evaluatorInstitutionDto.documentType = evaluatorInstitution.commonEntity.documentType
    evaluatorInstitutionDto.documentNumber = evaluatorInstitution.commonEntity.documentNumber
    evaluatorInstitutionDto.address = EvaluatorInstitutionAddressDto.fromEntity(evaluatorInstitution.address)

    return evaluatorInstitutionDto
  }
}
