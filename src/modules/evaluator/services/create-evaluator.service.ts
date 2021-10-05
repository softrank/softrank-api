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

export class CreateEvaluatorService {
  constructor(
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>,
    private readonly createCommonEntityService: CreateCommonEntityService
  ) {}

  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(createEvaluatorDto: CreateEvaluatorDto, userId: string): Promise<EvaluatorDto> {
    const createdEvaluator = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluatorDto, userId, manager)
    })

    const evaluator = this.transformToEvaluatorDto(createdEvaluator)
    return evaluator
  }

  public async createWithTransaction(
    createEvaluatorDto: CreateEvaluatorDto,
    userId: string,
    manager: EntityManager
  ): Promise<Evaluator> {
    this.setManager(manager)

    await this.verifyEvaluatorConflicts(createEvaluatorDto)
    const commonEntity = await this.findCommonEntity(createEvaluatorDto)
    const evaluatorToCreate = await this.buildEvaluatorEntity(createEvaluatorDto, commonEntity, userId)
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

  private async findCommonEntity({ email, documentNumber }: CreateEvaluatorDto): Promise<CommonEntity> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    return commonEntity
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

  private async buildEvaluatorEntity(
    createEvaluatorDto: CreateEvaluatorDto,
    commonEntity: CommonEntity,
    userId: string
  ): Promise<Evaluator> {
    const licenses = await this.buildEvaluatorLicences(createEvaluatorDto.licenses)
    const evaluatorInstitution = await this.findEvaluatorInstitution(
      createEvaluatorDto.evaluatorInstitutionId
    )

    const evaluator = new Evaluator()

    evaluator.licenses = licenses
    evaluator.commonEntity = commonEntity || (await this.createCommonEntity(createEvaluatorDto, userId))
    evaluator.evaluatorInstitution = evaluatorInstitution

    return evaluator
  }

  private async createCommonEntity(
    createEvaluatorDto: CreateEvaluatorDto,
    userId: string
  ): Promise<CommonEntity> {
    const dto = this.transformToCreateCommonEntityDto(createEvaluatorDto, userId)
    const createdCommonEntity = await this.createCommonEntityService.createWithTransaction(dto, this.manager)

    return createdCommonEntity
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
