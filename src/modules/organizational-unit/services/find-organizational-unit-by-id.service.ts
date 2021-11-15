import { OrganizationalUnitRepository } from '@modules/organizational-unit/repositories'
import { OrganizationalUnitNotFound } from '@modules/organizational-unit/errors'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'

export class FindOrganizationalUnitByIdService {
  constructor(private readonly organizationalUnitRepository: OrganizationalUnitRepository) {}

  public async find(organizationalUnitId: string): Promise<OrganizationalUnitDto> {
    const organizationalUnit = await this.findOrganizationalUnitById(organizationalUnitId)
    return OrganizationalUnitDto.fromEntity(organizationalUnit)
  }

  private async findOrganizationalUnitById(organizationalUnitId: string): Promise<OrganizationalUnit> {
    const organizationalUnit = await this.organizationalUnitRepository.findById(organizationalUnitId)

    if (!organizationalUnit) {
      throw new OrganizationalUnitNotFound()
    }

    return organizationalUnit
  }
}
