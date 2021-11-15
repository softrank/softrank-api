import { OrganizationalUnitAlreadyExist } from '@modules/organizational-unit/errors'
import { CreateOrganizationalUnitDto } from '@modules/organizational-unit/dtos'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { CreateCommonEntityService } from '@modules/public/services'
import { ManagedService } from '@modules/shared/services'
import { EntityStatusEnum } from '@modules/shared/enums'
import { CommonEntity } from '@modules/public/entities'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateOrganizationalUnitService extends ManagedService {
  constructor(private readonly createCommonEntityService: CreateCommonEntityService) {
    super()
  }

  public async create(createOrganizationalUnitDto: CreateOrganizationalUnitDto): Promise<any> {
    const organizationalUnit = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createOrganizationalUnitDto, manager)
    })

    return organizationalUnit
  }

  public async createWithTransaction(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto,
    manager: EntityManager
  ): Promise<OrganizationalUnit> {
    this.setManager(manager)

    await this.verifyOrganizationalUnitConflicts(createOrganizationalUnitDto)
    const commonEntity = await this.findCommonEntity(createOrganizationalUnitDto)
    const organizationalUnit = await this.buildOrganizationalUnitEntity(
      createOrganizationalUnitDto,
      commonEntity
    )
    const createdOrganizationalUnit = await this.manager.save(organizationalUnit)
    this.cleanManager()
    return createdOrganizationalUnit
  }

  private async verifyOrganizationalUnitConflicts(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto
  ): Promise<void | never> {
    const organizationalUnit = await this.manager
      .createQueryBuilder(OrganizationalUnit, 'organzationalUnit')
      .leftJoin('organzationalUnit.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber')
      .orWhere('commonEntity.email = :email')
      .setParameters({
        documentNumber: createOrganizationalUnitDto.documentNumber,
        email: createOrganizationalUnitDto.email
      })
      .getOne()

    if (organizationalUnit) {
      throw new OrganizationalUnitAlreadyExist()
    }
  }

  private findCommonEntity(createOrganizationalUnitDto: CreateOrganizationalUnitDto): Promise<CommonEntity> {
    const commonEntity = this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber')
      .orWhere('commonEntity.email = :email')
      .setParameters({
        documentNumber: createOrganizationalUnitDto.documentNumber,
        email: createOrganizationalUnitDto.email
      })
      .getOne()

    return commonEntity
  }

  private async buildOrganizationalUnitEntity(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto,
    commonEntity: CommonEntity
  ): Promise<OrganizationalUnit> {
    const urganizationalUnit = new OrganizationalUnit()

    urganizationalUnit.status = EntityStatusEnum.PENDING
    urganizationalUnit.commonEntity =
      commonEntity || (await this.createCommonEntity(createOrganizationalUnitDto))

    return urganizationalUnit
  }

  private createCommonEntity(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto
  ): Promise<CommonEntity> {
    const commonEntity = this.createCommonEntityService.createWithTransaction(
      createOrganizationalUnitDto,
      this.manager
    )

    return commonEntity
  }
}
