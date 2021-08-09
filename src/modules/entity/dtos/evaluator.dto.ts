import { DocumentTypeEnum } from '@shared/enums'
import { EntityEntity } from '../entities/entity.entity'

export class EvaluatorDto {
  id: string
  name: string
  email: string
  documentType: DocumentTypeEnum
  documentNumber: string
  phone: string
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
