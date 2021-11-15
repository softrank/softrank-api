import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { Auditor } from '@modules/auditor/entities'

export class AuditorDto {
  id: string
  name: string
  status: EntityStatusEnum
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string

  static fromEntity(auditor: Auditor): AuditorDto {
    const auditorDto = new AuditorDto()

    auditorDto.id = auditor.id
    auditorDto.status = auditor.status
    auditorDto.name = auditor.commonEntity.name
    auditorDto.documentNumber = auditor.commonEntity.documentNumber
    auditorDto.documentType = auditor.commonEntity.documentType
    auditorDto.email = auditor.commonEntity.email
    auditorDto.phone = auditor.commonEntity.phone

    return auditorDto
  }
}
