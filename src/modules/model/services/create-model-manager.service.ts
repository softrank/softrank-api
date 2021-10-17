import { getConnection, EntityManager } from 'typeorm'
import { CreateModelManagerDto } from '../dtos/create-model-manager.dto'
import { ManagedService } from '../../shared/services/managed.service'
import { ModelManager } from '../entities/model-manager.entity'
import { ModelManagerAlreadyExistsError } from '../errors/model-manager-errors'
import { CreateCommonEntityService } from '../../public/services/create-common-entity.service'
import { CommonEntity } from '../../public/entities/entity.entity'
import { CreateUserRoleService } from '../../public/services/create-user-role.service'
import { UserRoleEnum } from '@modules/shared/enums'
import { ModelManagerDto } from '../../shared/dtos/model/model-manager.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateModelManagerService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService
  ) {
    super()
  }

  public async create(createModelManagerDto: CreateModelManagerDto): Promise<ModelManagerDto> {
    const createdModelManager = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createModelManagerDto, manager)
    })

    return ModelManagerDto.fromEntity(createdModelManager)
  }

  public async createWithTransaction(
    createModelManagerDto: CreateModelManagerDto,
    manager: EntityManager
  ): Promise<ModelManager> {
    this.setManager(manager)

    await this.verifyModelManagerConflicts(createModelManagerDto)
    const commonEntity = await this.createCommonEntityService.createWithTransaction(
      createModelManagerDto,
      this.manager
    )
    const modelManagerToCreate = this.buildModelManagerEntity(commonEntity)
    const createdModelManager = await this.manager.save(modelManagerToCreate)
    await this.createUserRoleService.createWithTransaction(
      {
        userId: createModelManagerDto.userId,
        role: UserRoleEnum.MODEL_MANAGER
      },
      this.manager
    )

    this.cleanManager()

    return createdModelManager
  }

  private async verifyModelManagerConflicts(
    createModelManagerDto: CreateModelManagerDto
  ): Promise<void | never> {
    const modelManager = await this.manager
      .createQueryBuilder(ModelManager, 'modelManager')
      .leftJoin('modelManager.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', {
        documentNumber: createModelManagerDto.documentNumber
      })
      .orWhere('commonEntity.email = :email', { email: createModelManagerDto.email })
      .getOne()

    if (modelManager) {
      throw new ModelManagerAlreadyExistsError()
    }
  }

  private buildModelManagerEntity(commonEntity: CommonEntity): ModelManager {
    const modelManager = new ModelManager()

    modelManager.commonEntity = commonEntity

    return modelManager
  }
}
