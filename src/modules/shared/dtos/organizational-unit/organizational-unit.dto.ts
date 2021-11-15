import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'

export class OrganizationalUnitDto {
  id: string
  name: string
  status: EntityStatusEnum
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string

  static fromEntity(organizationalUnit: OrganizationalUnit): OrganizationalUnitDto {
    const auditorDto = new OrganizationalUnitDto()

    auditorDto.id = organizationalUnit.id
    auditorDto.status = organizationalUnit.status
    auditorDto.name = organizationalUnit.commonEntity.name
    auditorDto.documentNumber = organizationalUnit.commonEntity.documentNumber
    auditorDto.documentType = organizationalUnit.commonEntity.documentType
    auditorDto.email = organizationalUnit.commonEntity.email
    auditorDto.phone = organizationalUnit.commonEntity.phone

    return auditorDto
  }
}
