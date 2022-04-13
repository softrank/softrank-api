import { OrganizationalUnitProject } from '@modules/organizational-unit/entities'

export class OrganizationalUnitProjectDto {
  id: string
  name: string

  static fromEntity(organizationalUnitProject: OrganizationalUnitProject): OrganizationalUnitProjectDto {
    const organizationalUnitProjectDto = new OrganizationalUnitProjectDto()

    organizationalUnitProjectDto.id = organizationalUnitProject.id
    organizationalUnitProjectDto.name = organizationalUnitProject.name

    return organizationalUnitProjectDto
  }
}
