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

@Injectable()
export class CreateAuditorService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService
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
    const commonEntity = await this.findCommonEntity(createAuditorDto)
    const auditor = await this.buildAuditorEntity(createAuditorDto, commonEntity)
    const createdAuditor = await this.manager.save(auditor)
    await this.createUserRoleService.createWithTransaction(
      {
        userId: createAuditorDto.userId,
        role: UserRoleEnum.AUDITOR
      },
      this.manager
    )

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

  private async findCommonEntity(createAuditorDto: CreateAuditorDto): Promise<CommonEntity> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', {
        documentNumber: createAuditorDto.documentNumber
      })
      .orWhere('commonEntity.email = :email', { email: createAuditorDto.email })
      .getOne()

    return commonEntity
  }

  private async createCommonEntity(createAuditorDto: CreateAuditorDto): Promise<CommonEntity> {
    const commonEntity = await this.createCommonEntityService.createWithTransaction(
      createAuditorDto,
      this.manager
    )
    return commonEntity
  }

  private async buildAuditorEntity(
    createAuditorDto: CreateAuditorDto,
    commonEntity: CommonEntity
  ): Promise<Auditor> {
    const auditor = new Auditor()

    auditor.status = EntityStatusEnum.PENDING
    auditor.commonEntity = commonEntity || (await this.createCommonEntity(createAuditorDto))

    return auditor
  }
}
