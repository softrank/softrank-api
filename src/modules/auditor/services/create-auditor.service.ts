import { AuditorDto } from '@modules/shared/dtos/auditor'
import { ManagedService } from '../../shared/services/managed.service'
import { CreateAuditorDto } from '../dtos/create-auditor.dto'
import { EntityManager, getConnection } from 'typeorm'
import { CreateCommonEntityService } from '../../public/services/create-common-entity.service'
import { CommonEntity } from '@modules/public/entities'
import { Auditor } from '../entities/auditor.entity'
import { AuditorAlreadyExists } from '../errors'
import { CreateUserRoleService } from '../../public/services/create-user-role.service'
import { EntityStatusEnum, UserRoleEnum } from '@modules/shared/enums'
import { Injectable } from '@nestjs/common'
import { CommonEntityAlreadyExistsError } from '../../public/errors/common-entity.errors'
import { CreateUserDto } from '../../public/dtos/create-user.dto'
import { User } from '../../public/entities/user.entity'
import { CreateUserService } from '../../public/services/create-user.service'

@Injectable()
export class CreateAuditorService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService,
    private readonly createUserService: CreateUserService
  ) {
    super()
  }

  public async create(createAuditorDto: CreateAuditorDto): Promise<AuditorDto> {
    const auditor = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createAuditorDto, manager)
    })

    return AuditorDto.fromEntity(auditor)
  }

  public async createWithTransaction(
    createAuditorDto: CreateAuditorDto,
    manager: EntityManager
  ): Promise<Auditor> {
    this.setManager(manager)

    await this.verifyAuditorConflicts(createAuditorDto)
    const commonEntity = await this.verifyCommonEntity(createAuditorDto)
    const auditor = await this.buildAuditorEntity(createAuditorDto)
    const createdAuditor = await this.manager.save(auditor)

    this.cleanManager()
    return createdAuditor
  }

  private async verifyAuditorConflicts(createAuditorDto: CreateAuditorDto): Promise<void | never> {
    const auditor = await this.manager
      .createQueryBuilder(Auditor, 'auditor')
      .leftJoinAndSelect('auditor.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', {
        documentNumber: createAuditorDto.documentNumber
      })
      .orWhere('commonEntity.email = :email', { email: createAuditorDto.email })
      .getOne()

    if (auditor) {
      throw new AuditorAlreadyExists()
    }
  }

  private async verifyCommonEntity(createAuditorDto: CreateAuditorDto): Promise<void> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', {
        documentNumber: createAuditorDto.documentNumber
      })
      .orWhere('commonEntity.email = :email', { email: createAuditorDto.email })
      .getOne()

    if (commonEntity) {
      throw new CommonEntityAlreadyExistsError()
    }
  }

  private async createCommonEntity(
    createAuditorDto: CreateAuditorDto,
    userId: string
  ): Promise<CommonEntity> {
    const commonEntity = await this.createCommonEntityService.createWithTransaction(
      { ...createAuditorDto, userId },
      this.manager
    )
    return commonEntity
  }

  private async buildAuditorEntity(createAuditorDto: CreateAuditorDto): Promise<Auditor> {
    const user = await this.createUser(createAuditorDto)
    const commonEntity = await this.createCommonEntity(createAuditorDto, user.id)
    const auditor = new Auditor()

    auditor.status = EntityStatusEnum.PENDING
    auditor.commonEntity = commonEntity

    return auditor
  }

  private async createUser(createAuditorDto: CreateAuditorDto): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createAuditorDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, this.manager)
    await this.createUserRole(user.id)

    return user
  }

  private async createUserRole(userId: string): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.AUDITOR,
        userId
      },
      this.manager
    )
  }

  private buildCreateUserDto(createAuditorDto: CreateAuditorDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createAuditorDto.email
    createUserDto.password = createAuditorDto.password

    return createUserDto
  }
}
