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
import { CreateUserDto, LoginResponseDto } from '@modules/public/dtos'
import { User } from '../../public/entities/user.entity'
import { CreateUserService } from '../../public/services/create-user.service'
import { LoginAfterCreateService } from '@modules/public/services'

@Injectable()
export class CreateModelManagerService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService,
    private readonly createUserService: CreateUserService,
    private readonly loginAfterCreateService: LoginAfterCreateService
  ) {
    super()
  }

  public async create(createModelManagerDto: CreateModelManagerDto): Promise<ModelManagerDto> {
    const createdModelManager = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createModelManagerDto, manager)
    })

    const authorizationDto = await this.loginAfterCreate(createdModelManager.id)
    return ModelManagerDto.fromEntity(createdModelManager, authorizationDto)
  }

  private loginAfterCreate(userId: string): Promise<LoginResponseDto> {
    const loginResponse = this.loginAfterCreateService.login(userId)
    return loginResponse
  }

  public async createWithTransaction(createModelManagerDto: CreateModelManagerDto, manager: EntityManager): Promise<ModelManager> {
    this.setManager(manager)

    await this.verifyModelManagerConflicts(createModelManagerDto)
    const commonEntity = await this.createCommonEntity(createModelManagerDto)
    const modelManagerToCreate = this.buildModelManagerEntity(commonEntity)
    const createdModelManager = await this.manager.save(modelManagerToCreate)

    this.cleanManager()

    return createdModelManager
  }

  private async verifyModelManagerConflicts(createModelManagerDto: CreateModelManagerDto): Promise<void | never> {
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

  private async createCommonEntity(createModelManagerDto: CreateModelManagerDto): Promise<CommonEntity> {
    const user = await this.createUser(createModelManagerDto)
    const commonEntity = await this.createCommonEntityService.createWithTransaction(
      { ...createModelManagerDto, userId: user.id },
      this.manager
    )

    return commonEntity
  }

  private async createUser(createModelManagerDto: CreateModelManagerDto): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createModelManagerDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, this.manager)
    await this.createUserRole(user.id)

    return user
  }

  private async createUserRole(userId: string): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.MODEL_MANAGER,
        userId
      },
      this.manager
    )
  }

  private buildCreateUserDto(createModelManagerDto: CreateModelManagerDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createModelManagerDto.email
    createUserDto.password = createModelManagerDto.password

    return createUserDto
  }
}
