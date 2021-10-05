import { EvaluatorInstitutionAddress } from '@modules/evaluator-institution/entities'
import { ApiProperty } from '@nestjs/swagger'

export class EvaluatorInstitutionAddressDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  zipcode: string

  @ApiProperty()
  addressLine: string

  @ApiProperty()
  number: string

  @ApiProperty()
  observation: string

  @ApiProperty()
  city: string

  @ApiProperty()
  state: string

  static fromEntity(evaluatorInstitutionAddress: EvaluatorInstitutionAddress): EvaluatorInstitutionAddressDto {
    const evaluatorInstitutionAddressDto = new EvaluatorInstitutionAddressDto()

    evaluatorInstitutionAddressDto.id = evaluatorInstitutionAddress.id
    evaluatorInstitutionAddressDto.zipcode = evaluatorInstitutionAddress.zipcode
    evaluatorInstitutionAddressDto.addressLine = evaluatorInstitutionAddress.addressLine
    evaluatorInstitutionAddressDto.number = evaluatorInstitutionAddress.number
    evaluatorInstitutionAddressDto.observation = evaluatorInstitutionAddress.observation
    evaluatorInstitutionAddressDto.state = evaluatorInstitutionAddress.state
    evaluatorInstitutionAddressDto.city = evaluatorInstitutionAddress.city

    return evaluatorInstitutionAddressDto
  }
}
