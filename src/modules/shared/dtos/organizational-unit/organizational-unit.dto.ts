import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { OrganizationalUnitProjectDto } from '.'

export class OrganizationalUnitDto {
  id: string
  name: string
  status: EntityStatusEnum
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string
  projects: OrganizationalUnitProjectDto[]

  static fromEntity(organizationalUnit: OrganizationalUnit): OrganizationalUnitDto {
    const auditorDto = new OrganizationalUnitDto()

    auditorDto.id = organizationalUnit.id
    auditorDto.status = organizationalUnit.status
    auditorDto.name = organizationalUnit.commonEntity.name
    auditorDto.documentNumber = organizationalUnit.commonEntity.documentNumber
    auditorDto.documentType = organizationalUnit.commonEntity.documentType
    auditorDto.email = organizationalUnit.commonEntity.email
    auditorDto.phone = organizationalUnit.commonEntity.phone
    auditorDto.projects = organizationalUnit.projects?.map(OrganizationalUnitProjectDto.fromEntity)

    return auditorDto
  }
}
