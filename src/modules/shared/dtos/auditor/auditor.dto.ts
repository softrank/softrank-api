import { DocumentTypeEnum } from '@modules/shared/enums'
import { Auditor } from '../../../auditor/entities/auditor.entity'

export class AuditorDto {
  id: string
  name: string
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string

  static fromEntity(auditor: Auditor): AuditorDto {
    const auditorDto = new AuditorDto()

    auditorDto.id = auditor.id
    auditorDto.name = auditor.commonEntity.name
    auditorDto.documentNumber = auditor.commonEntity.documentNumber
    auditorDto.documentType = auditor.commonEntity.documentType
    auditorDto.email = auditor.commonEntity.email
    auditorDto.phone = auditor.commonEntity.phone

    return auditorDto
  }
}
