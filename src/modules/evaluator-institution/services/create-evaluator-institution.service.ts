import { CreateEvaluatorInsitutionAddressDto, CreateEvaluatorInstitutionDto } from '@modules/evaluator-institution/dtos'
import { EvaluatorInstitutionAddress, EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { CreateCommonEntityService, LoginAfterCreateService } from '@modules/public/services'
import { CreateCommonEntityDto, LoginResponseDto } from '@modules/public/dtos'
import { CommonEntity } from '@modules/public/entities'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EvaluatorInstitutionAlreadyExistsError } from '../errors/evaluator-institution.errors'
import { CreateUserRoleService } from '../../public/services/create-user-role.service'
import { ManagedService } from '../../shared/services/managed.service'
import { UserRoleEnum } from '@modules/shared/enums'
import { EntityStatusEnum } from '../../shared/enums/entity-status.enum'
import { CommonEntityAlreadyExistsError } from '../../public/errors/common-entity.errors'
import { CreateUserDto } from '../../public/dtos/create-user.dto'
import { User } from '../../public/entities/user.entity'
import { CreateUserService } from '../../public/services/create-user.service'

@Injectable()
export class CreateEvaluatorInstitutionService extends ManagedService {
  constructor(
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService,
    private readonly createUserService: CreateUserService,
    private readonly loginAfterCreateService: LoginAfterCreateService
  ) {
    super()
  }

  public async create(createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto): Promise<EvaluatorInstitutionDto> {
    const createdEvaluatorInstitution = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluatorInstitutionDto, manager)
    })

    const authorizationDto = await this.loginAfterCreate(createdEvaluatorInstitution.id)
    return EvaluatorInstitutionDto.fromEntity(createdEvaluatorInstitution, authorizationDto)
  }

  private loginAfterCreate(userId: string): Promise<LoginResponseDto> {
    const loginResponse = this.loginAfterCreateService.login(userId)
    return loginResponse
  }

  public async createWithTransaction(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    manager: EntityManager
  ): Promise<EvaluatorInstitution> {
    this.setManager(manager)

    await this.verifyEvaluatorInstitutionConflicts(createEvaluatorInstitutionDto)
    await this.verifyCommonEntity(createEvaluatorInstitutionDto)
    const builtEvaluatorInstitution = await this.buildEvaluatorInstitutionEntity(createEvaluatorInstitutionDto)
    const createdEvaluatorInstitution = await this.manager.save(builtEvaluatorInstitution)

    this.cleanManager()
    return createdEvaluatorInstitution
  }

  private async verifyEvaluatorInstitutionConflicts({ documentNumber, email }: CreateEvaluatorInstitutionDto): Promise<void | never> {
    const evaluatorInstitution = await this.manager
      .createQueryBuilder(EvaluatorInstitution, 'evaluatorInstitution')
      .leftJoin('evaluatorInstitution.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (evaluatorInstitution) {
      throw new EvaluatorInstitutionAlreadyExistsError()
    }
  }

  private async verifyCommonEntity({ documentNumber, email }: CreateEvaluatorInstitutionDto): Promise<void> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (commonEntity) {
      throw new CommonEntityAlreadyExistsError()
    }
  }

  private async createCommonEntity(createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto): Promise<CommonEntity> {
    const user = await this.createUser(createEvaluatorInstitutionDto)
    const dto = this.transformToCreateCommonEntityDto(createEvaluatorInstitutionDto, user.id)
    const createdCommonEntity = await this.createCommonEntityService.createWithTransaction(dto, this.manager)

    return createdCommonEntity
  }

  private async createUser(createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createEvaluatorInstitutionDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, this.manager)
    await this.createUserRole(user.id)

    return user
  }

  private async createUserRole(userId: string): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.EVALUATOR_INSTITUTION,
        userId
      },
      this.manager
    )
  }

  private buildCreateUserDto(createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createEvaluatorInstitutionDto.email
    createUserDto.password = createEvaluatorInstitutionDto.password

    return createUserDto
  }

  private transformToCreateCommonEntityDto(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    userId: string
  ): CreateCommonEntityDto {
    const dto = new CreateCommonEntityDto()

    dto.documentNumber = createEvaluatorInstitutionDto.documentNumber
    dto.documentType = createEvaluatorInstitutionDto.documentType
    dto.email = createEvaluatorInstitutionDto.email
    dto.name = createEvaluatorInstitutionDto.name
    dto.phone = createEvaluatorInstitutionDto.phone
    dto.userId = userId

    return dto
  }

  private async buildEvaluatorInstitutionEntity(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto
  ): Promise<EvaluatorInstitution> {
    const commonEntity = await this.createCommonEntity(createEvaluatorInstitutionDto)
    const evaluatorInstitution = new EvaluatorInstitution()

    evaluatorInstitution.status = EntityStatusEnum.PENDING
    evaluatorInstitution.addresses = this.buildEvaluatorInstitutionAddressEntity(createEvaluatorInstitutionDto.address)
    evaluatorInstitution.commonEntity = commonEntity

    return evaluatorInstitution
  }

  private buildEvaluatorInstitutionAddressEntity(
    createEvaluatorInsitutionAddressDto: CreateEvaluatorInsitutionAddressDto
  ): EvaluatorInstitutionAddress[] {
    const evaluatorInstitutionAddress = new EvaluatorInstitutionAddress()

    evaluatorInstitutionAddress.zipcode = createEvaluatorInsitutionAddressDto.zipcode
    evaluatorInstitutionAddress.addressLine = createEvaluatorInsitutionAddressDto.addressLine
    evaluatorInstitutionAddress.number = createEvaluatorInsitutionAddressDto.number
    evaluatorInstitutionAddress.observation = createEvaluatorInsitutionAddressDto.observation
    evaluatorInstitutionAddress.state = createEvaluatorInsitutionAddressDto.state
    evaluatorInstitutionAddress.city = createEvaluatorInsitutionAddressDto.city

    return [evaluatorInstitutionAddress]
  }
}
