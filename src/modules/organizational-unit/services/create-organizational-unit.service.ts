import { CreateCommonEntityService, CreateUserService, CreateUserRoleService } from '@modules/public/services'
import { OrganizationalUnit, OrganizationalUnitProject } from '@modules/organizational-unit/entities'
import { OrganizationalUnitAlreadyExist } from '@modules/organizational-unit/errors'
import { CreateOrganizationalUnitDto } from '@modules/organizational-unit/dtos'
import { CommonEntityAlreadyExistsError } from '@modules/public/errors'
import { EntityStatusEnum, UserRoleEnum } from '@modules/shared/enums'
import { CommonEntity, User } from '@modules/public/entities'
import { ManagedService } from '@modules/shared/services'
import { EntityManager, getConnection } from 'typeorm'
import { CreateUserDto } from '@modules/public/dtos'
import { Injectable } from '@nestjs/common'
import { OrganizationalUnitDto } from '../../shared/dtos/organizational-unit/organizational-unit.dto'

@Injectable()
export class CreateOrganizationalUnitService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserService: CreateUserService,
    private readonly createUserRoleService: CreateUserRoleService
  ) {
    super()
  }

  public async create(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto
  ): Promise<OrganizationalUnitDto> {
    const organizationalUnit = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createOrganizationalUnitDto, manager)
    })

    return OrganizationalUnitDto.fromEntity(organizationalUnit)
  }

  public async createWithTransaction(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto,
    manager: EntityManager
  ): Promise<OrganizationalUnit> {
    this.setManager(manager)

    await this.verifyOrganizationalUnitConflicts(createOrganizationalUnitDto)
    await this.verifyCommonEntity(createOrganizationalUnitDto)
    const organizationalUnit = await this.buildOrganizationalUnitEntity(createOrganizationalUnitDto)
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

  private async verifyCommonEntity(createOrganizationalUnitDto: CreateOrganizationalUnitDto): Promise<void> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber')
      .orWhere('commonEntity.email = :email')
      .setParameters({
        documentNumber: createOrganizationalUnitDto.documentNumber,
        email: createOrganizationalUnitDto.email
      })
      .getOne()

    if (commonEntity) {
      throw new CommonEntityAlreadyExistsError()
    }
  }

  private async buildOrganizationalUnitEntity(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto
  ): Promise<OrganizationalUnit> {
    const commonEntity = await this.createCommonEntity(createOrganizationalUnitDto)
    const urganizationalUnit = new OrganizationalUnit()

    urganizationalUnit.status = EntityStatusEnum.PENDING
    urganizationalUnit.projects = this.buildOrganizationalUnitProjetcs(createOrganizationalUnitDto.projects)
    urganizationalUnit.commonEntity = commonEntity

    return urganizationalUnit
  }

  private buildOrganizationalUnitProjetcs(projects: string[]): OrganizationalUnitProject[] {
    const organizationalUnitProject = projects?.map(this.buildOrganizationalUnitPtoject)
    return organizationalUnitProject
  }

  private buildOrganizationalUnitPtoject(project: string): OrganizationalUnitProject {
    const organizationalUnitProject = new OrganizationalUnitProject()

    organizationalUnitProject.name = project

    return organizationalUnitProject
  }

  private async createCommonEntity(
    createOrganizationalUnitDto: CreateOrganizationalUnitDto
  ): Promise<CommonEntity> {
    const user = await this.createUser(createOrganizationalUnitDto)
    const commonEntity = this.createCommonEntityService.createWithTransaction(
      { ...createOrganizationalUnitDto, userId: user.id },
      this.manager
    )

    return commonEntity
  }

  private async createUser(createOrganizationalUnitDto: CreateOrganizationalUnitDto): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createOrganizationalUnitDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, this.manager)
    await this.createUserRole(user.id)

    return user
  }

  private async createUserRole(userId: string): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.ORGANIZATIONAL_UNIT,
        userId
      },
      this.manager
    )
  }

  private buildCreateUserDto(createOrganizationalUnitDto: CreateOrganizationalUnitDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createOrganizationalUnitDto.email
    createUserDto.password = createOrganizationalUnitDto.password

    return createUserDto
  }
}
