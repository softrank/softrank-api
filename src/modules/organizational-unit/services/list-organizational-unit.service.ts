import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { Injectable } from '@nestjs/common'
import { ListOrganizationalUnitQueryDto } from '../dtos'
import { OrganizationalUnit } from '../entities'
import { OrganizationalUnitRepository } from '../repositories/organizational-unit.repository'

@Injectable()
export class ListOrganizationalUnitService {
  constructor(private readonly organizationalUnitRepository: OrganizationalUnitRepository) {}

  public async list(
    listOrganizationalUnitQueryDto: ListOrganizationalUnitQueryDto
  ): Promise<OrganizationalUnitDto[]> {
    const organizationalUnits = await this.findOrganizationalUnits(listOrganizationalUnitQueryDto)
    return organizationalUnits.map(OrganizationalUnitDto.fromEntity)
  }

  private findOrganizationalUnits(
    listOrganizationalUnitQueryDto: ListOrganizationalUnitQueryDto
  ): Promise<OrganizationalUnit[]> {
    const queryBuilder = this.organizationalUnitRepository
      .createQueryBuilder('organizationalUnit')
      .leftJoinAndSelect('organizationalUnit.commonEntity', 'commonEntity')
      .leftJoinAndSelect('organizationalUnit.projects', 'projects')

    if (listOrganizationalUnitQueryDto.name) {
      queryBuilder.andWhere('unaccent(commonEntity.name) ilike unaccent(:name)', {
        name: `%${listOrganizationalUnitQueryDto.name}%`
      })
    }

    if (listOrganizationalUnitQueryDto.documentNumber) {
      queryBuilder.andWhere('commonEntity.documentNumber like :documentNumber', {
        documentNumber: `${listOrganizationalUnitQueryDto.documentNumber}%`
      })
    }

    if (listOrganizationalUnitQueryDto.status) {
      queryBuilder.andWhere('organizationalUnit.status = :status', {
        status: listOrganizationalUnitQueryDto.status
      })
    }

    const organizationalUnits = queryBuilder.getMany()

    return organizationalUnits
  }
}
