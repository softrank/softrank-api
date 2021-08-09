import { EntityEntity } from '@modules/entity/entities'
import { DocumentTypeEnum } from '@shared/enums'
import { ApiProperty } from '@nestjs/swagger'

export class EvaluatorDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  documentType: DocumentTypeEnum

  @ApiProperty()
  documentNumber: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  userId?: string

  static fromEntity(entity: EntityEntity): EvaluatorDto {
    const dto = new EvaluatorDto()

    dto.id = entity.id
    dto.name = entity.name
    dto.phone = entity.phone
    dto.email = entity.email
    dto.documentNumber = entity.documentNumber
    dto.documentType = entity.documentType
    dto.userId = entity.userId

    return dto
  }
}
