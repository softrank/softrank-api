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
    const organizationalUnitDto = new OrganizationalUnitDto()

    organizationalUnitDto.id = organizationalUnit.id
    organizationalUnitDto.status = organizationalUnit.status
    organizationalUnitDto.name = organizationalUnit.commonEntity.name
    organizationalUnitDto.documentNumber = organizationalUnit.commonEntity.documentNumber
    organizationalUnitDto.documentType = organizationalUnit.commonEntity.documentType
    organizationalUnitDto.email = organizationalUnit.commonEntity.email
    organizationalUnitDto.phone = organizationalUnit.commonEntity.phone
    organizationalUnitDto.projects = organizationalUnit.projects?.map(OrganizationalUnitProjectDto.fromEntity)
    organizationalUnitDto.authorization = authorization

    return organizationalUnitDto
  }
}
