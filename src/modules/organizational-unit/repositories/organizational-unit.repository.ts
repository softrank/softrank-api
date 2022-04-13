import { EntityRepository, Repository } from 'typeorm'
import { OrganizationalUnit } from '../entities'

@EntityRepository(OrganizationalUnit)
export class OrganizationalUnitRepository extends Repository<OrganizationalUnit> {
  public findById(organizationalUnitId: string): Promise<OrganizationalUnit> {
    const organizationalUnit = this.createQueryBuilder('organizationalUnit')
      .leftJoinAndSelect('organizationalUnit.commonEntity', 'commonEntity')
      .where('organizationalUnit.id = :organizationalUnitId', { organizationalUnitId })
      .getOne()

    return organizationalUnit
  }
}
