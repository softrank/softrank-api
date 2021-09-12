import { DocumentTypeEnum } from '@modules/shared/enums'
import { CommonEntity } from '@modules/public/entities'

export class CommonEntityDto {
  id: string
  name: string
  phone: string
  email: string
  documentNumber: string
  documentType: DocumentTypeEnum

  static fromEntity(commonEntity: CommonEntity): CommonEntityDto {
    const dto = new CommonEntityDto()

    dto.id = commonEntity.id
    dto.name = commonEntity.name
    dto.phone = commonEntity.phone
    dto.email = commonEntity.email
    dto.documentType = commonEntity.documentType
    dto.documentNumber = commonEntity.documentNumber

    return dto
  }
}
