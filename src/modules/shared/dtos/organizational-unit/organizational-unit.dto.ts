import { DocumentTypeEnum, EntityStatusEnum } from '@modules/shared/enums'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { OrganizationalUnitProjectDto } from '.'
import { LoginResponseDto } from '@modules/public/dtos'

export class OrganizationalUnitDto {
  id: string
  name: string
  status: EntityStatusEnum
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string
  projects: OrganizationalUnitProjectDto[]
  authorization: LoginResponseDto

  static fromEntity(organizationalUnit: OrganizationalUnit, authorization?: LoginResponseDto): OrganizationalUnitDto {
    const auditorDto = new OrganizationalUnitDto()

    auditorDto.id = organizationalUnit.id
    auditorDto.status = organizationalUnit.status
    auditorDto.name = organizationalUnit.commonEntity.name
    auditorDto.documentNumber = organizationalUnit.commonEntity.documentNumber
    auditorDto.documentType = organizationalUnit.commonEntity.documentType
    auditorDto.email = organizationalUnit.commonEntity.email
    auditorDto.phone = organizationalUnit.commonEntity.phone
    auditorDto.projects = organizationalUnit.projects?.map(OrganizationalUnitProjectDto.fromEntity)
    auditorDto.authorization = authorization

    return auditorDto
  }
}
