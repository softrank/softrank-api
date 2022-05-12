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
import { LoginAfterCreateService } from '@modules/public/services'
import { LoginResponseDto } from '@modules/public/dtos'

@Injectable()
export class CreateAuditorService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService,
    private readonly createUserService: CreateUserService,
    private readonly loginAfterCreateService: LoginAfterCreateService
  ) {}

  public async create(createAuditorDto: CreateAuditorDto): Promise<AuditorDto> {
    const auditor = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createAuditorDto, manager)
    })

    const authorizationDto = await this.loginAfterCreate(auditor.id)
    return AuditorDto.fromEntity(auditor, authorizationDto)
  }

  private loginAfterCreate(userId: string): Promise<LoginResponseDto> {
    const loginResponse = this.loginAfterCreateService.login(userId)
    return loginResponse
  }

  public async createWithTransaction(createAuditorDto: CreateAuditorDto, manager: EntityManager): Promise<Auditor> {
    await this.verifyAuditorConflicts(createAuditorDto, manager)
    await this.verifyCommonEntity(createAuditorDto, manager)
    const auditor = await this.buildAuditorEntity(createAuditorDto, manager)
    const createdAuditor = await manager.save(auditor)

    return createdAuditor
  }

  private async verifyAuditorConflicts(createAuditorDto: CreateAuditorDto, manager: EntityManager): Promise<void | never> {
    const auditor = await manager
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

  private async verifyCommonEntity(createAuditorDto: CreateAuditorDto, manager: EntityManager): Promise<void> {
    const commonEntity = await manager
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

  private async createCommonEntity(createAuditorDto: CreateAuditorDto, userId: string, manager: EntityManager): Promise<CommonEntity> {
    const commonEntity = await this.createCommonEntityService.createWithTransaction({ ...createAuditorDto, userId }, manager)
    return commonEntity
  }

  private async buildAuditorEntity(createAuditorDto: CreateAuditorDto, manager: EntityManager): Promise<Auditor> {
    const user = await this.createUser(createAuditorDto, manager)
    const commonEntity = await this.createCommonEntity(createAuditorDto, user.id, manager)
    const auditor = new Auditor()

    auditor.status = EntityStatusEnum.PENDING
    auditor.commonEntity = commonEntity

    return auditor
  }

  private async createUser(createAuditorDto: CreateAuditorDto, manager: EntityManager): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createAuditorDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, manager)
    await this.createUserRole(user.id, manager)

    return user
  }

  private async createUserRole(userId: string, manager: EntityManager): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.AUDITOR,
        userId
      },
      manager
    )
  }

  private buildCreateUserDto(createAuditorDto: CreateAuditorDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createAuditorDto.email
    createUserDto.password = createAuditorDto.password

    return createUserDto
  }
}
