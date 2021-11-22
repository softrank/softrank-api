import { EvaluatorInstitutionNotFoundError } from '@modules/evaluator-institution/errors'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { Evaluator, EvaluatorLicense } from '@modules/evaluator/entities'
import { CreateCommonEntityService } from '@modules/public/services'
import { CreateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { Repository, EntityManager, getConnection } from 'typeorm'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { CreateEvaluatorDto } from '@modules/evaluator/dtos'
import { CreateCommonEntityDto } from '@modules/public/dtos'
import { CommonEntity } from '@modules/public/entities'
import { ModelLevel } from '@modules/model/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluatorAlreadyExistsError } from '../errors'
import { CreateUserRoleService } from '../../public/services/create-user-role.service'
import { UserRoleEnum } from '@modules/shared/enums'
import { ManagedService } from '../../shared/services/managed.service'
import { EntityStatusEnum } from '../../shared/enums/entity-status.enum'
import { CommonEntityAlreadyExistsError } from '../../public/errors/common-entity.errors'
import { CreateUserDto } from '../../public/dtos/create-user.dto'
import { User } from '../../public/entities/user.entity'
import { CreateUserService } from '../../public/services/create-user.service'

export class CreateEvaluatorService extends ManagedService {
  constructor(
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>,
    private readonly createCommonEntityService: CreateCommonEntityService,
    private readonly createUserRoleService: CreateUserRoleService,
    private readonly createUserService: CreateUserService
  ) {
    super()
  }

  public async create(createEvaluatorDto: CreateEvaluatorDto): Promise<EvaluatorDto> {
    const createdEvaluator = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluatorDto, manager)
    })

    const evaluator = this.transformToEvaluatorDto(createdEvaluator)
    return evaluator
  }

  public async createWithTransaction(
    createEvaluatorDto: CreateEvaluatorDto,
    manager: EntityManager
  ): Promise<Evaluator> {
    this.setManager(manager)

    await this.verifyEvaluatorConflicts(createEvaluatorDto)
    await this.verifyCommonEntity(createEvaluatorDto)
    const evaluatorToCreate = await this.buildEvaluatorEntity(createEvaluatorDto)
    const createdEvaluator = await this.manager.save(evaluatorToCreate)

    this.cleanManager()

    return createdEvaluator
  }

  private async verifyEvaluatorConflicts({
    email,
    documentNumber
  }: CreateEvaluatorDto): Promise<void | never> {
    const evaluator = await this.manager
      .createQueryBuilder(Evaluator, 'evaluator')
      .leftJoin('evaluator.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (evaluator) {
      throw new EvaluatorAlreadyExistsError()
    }
  }

  private async verifyCommonEntity({ email, documentNumber }: CreateEvaluatorDto): Promise<void> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (commonEntity) {
      throw new CommonEntityAlreadyExistsError()
    }
  }

  private async findModelLevel(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.modelLevelRepository.findOne({
      where: { id: modelLevelId }
    })

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private async findEvaluatorInstitution(evaluatorInstitutionId: string): Promise<EvaluatorInstitution> {
    const evaluatorInstitution = await this.evaluatorInstitutionRepository.findOne({
      where: { id: evaluatorInstitutionId }
    })

    if (!evaluatorInstitution) {
      throw new EvaluatorInstitutionNotFoundError()
    }

    return evaluatorInstitution
  }

  private async buildEvaluatorEntity(createEvaluatorDto: CreateEvaluatorDto): Promise<Evaluator> {
    const licenses = await this.buildEvaluatorLicences(createEvaluatorDto.licenses)
    const evaluatorInstitution = await this.findEvaluatorInstitution(
      createEvaluatorDto.evaluatorInstitutionId
    )
    const commonEntity = await this.createCommonEntity(createEvaluatorDto)

    const evaluator = new Evaluator()

    evaluator.status = EntityStatusEnum.PENDING
    evaluator.licenses = licenses
    evaluator.commonEntity = commonEntity
    evaluator.evaluatorInstitution = evaluatorInstitution

    return evaluator
  }

  private async createCommonEntity(createEvaluatorDto: CreateEvaluatorDto): Promise<CommonEntity> {
    const user = await this.createUser(createEvaluatorDto)
    const dto = this.transformToCreateCommonEntityDto(createEvaluatorDto, user.id)
    const createdCommonEntity = await this.createCommonEntityService.createWithTransaction(dto, this.manager)

    return createdCommonEntity
  }

  private async createUser(createEvaluatorDto: CreateEvaluatorDto): Promise<User> {
    const createUserDto = this.buildCreateUserDto(createEvaluatorDto)
    const user = await this.createUserService.createWithTransaction(createUserDto, this.manager)
    await this.createUserRole(user.id)

    return user
  }

  private async createUserRole(userId: string): Promise<void> {
    await this.createUserRoleService.createWithTransaction(
      {
        role: UserRoleEnum.EVALUATOR,
        userId
      },
      this.manager
    )
  }

  private buildCreateUserDto(createEvaluatorDto: CreateEvaluatorDto): CreateUserDto {
    const createUserDto = new CreateUserDto()

    createUserDto.login = createEvaluatorDto.email
    createUserDto.password = createEvaluatorDto.password

    return createUserDto
  }

  private transformToCreateCommonEntityDto(
    createEvaluatorDto: CreateEvaluatorDto,
    userId?: string
  ): CreateCommonEntityDto {
    const dto = new CreateCommonEntityDto()

    dto.documentNumber = createEvaluatorDto.documentNumber
    dto.documentType = createEvaluatorDto.documentType
    dto.email = createEvaluatorDto.email
    dto.name = createEvaluatorDto.name
    dto.phone = createEvaluatorDto.phone
    dto.userId = userId

    return dto
  }

  private async buildEvaluatorLicences(
    createEvaluatorLicensesDto: CreateEvaluatorLicenseDto[]
  ): Promise<EvaluatorLicense[]> {
    const evaluatorLicensesPromises = createEvaluatorLicensesDto.map(async (createEvaluatorLicenseDto) => {
      const modelLevel = await this.findModelLevel(createEvaluatorLicenseDto.modelLevelId)
      const evaluatorLicense = new EvaluatorLicense()

      evaluatorLicense.expiration = createEvaluatorLicenseDto.expiration
      evaluatorLicense.isActive = true
      evaluatorLicense.modelLevel = modelLevel

      return evaluatorLicense
    })

    const resolvedEvaluatorLicenses = await Promise.all(evaluatorLicensesPromises)
    return resolvedEvaluatorLicenses
  }

  private transformToEvaluatorDto(evaluator: Evaluator): EvaluatorDto {
    return EvaluatorDto.fromEntity(evaluator)
  }
}
