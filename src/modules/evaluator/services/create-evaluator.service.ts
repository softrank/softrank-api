import { EvaluatorLicenseAlreadyExistsError } from '@modules/evaluator/errors'
import { Evaluator, EvaluatorLicense } from '@modules/evaluator/entities'
import { In, Repository, EntityManager, getConnection } from 'typeorm'
import { CreateCommonEntityService } from '@modules/public/services'
import { CreateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { CreateEvaluatorDto } from '@modules/evaluator/dtos'
import { CreateCommonEntityDto } from '@modules/public/dtos'
import { CommonEntity } from '@modules/public/entities'
import { ModelLevel } from '@modules/model/entities'
import { InjectRepository } from '@nestjs/typeorm'

export class CreateEvaluatorService {
  constructor(
    @InjectRepository(EvaluatorLicense)
    private readonly evaluatorLicenseRepository: Repository<EvaluatorLicense>,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
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

    await this.checkEvaluatorLicenseConflicts(createEvaluatorDto)
    const evaluatorToCreate = await this.buildEvaluatorEntity(createEvaluatorDto, userId)
    const createdEvaluator = await this.manager.save(evaluatorToCreate)

    this.cleanManager()

    return createdEvaluator
  }

  private async checkEvaluatorLicenseConflicts(createEvaluatorDto: CreateEvaluatorDto): Promise<void | never> {
    const licensesNumber = createEvaluatorDto.licenses.map((license) => license.number)
    const evaluatorLicense = await this.evaluatorLicenseRepository.findOne({
      where: { number: In(licensesNumber) }
    })

    if (evaluatorLicense) {
      throw new EvaluatorLicenseAlreadyExistsError()
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

  private async buildEvaluatorEntity(createEvaluatorDto: CreateEvaluatorDto, userId: string): Promise<Evaluator> {
    const commonEntity = await this.createCommonEntity(createEvaluatorDto, userId)
    const licenses = await this.buildEvaluatorLicences(createEvaluatorDto.licenses)
    const evaluator = new Evaluator()

    evaluator.licenses = licenses
    evaluator.commonEntity = commonEntity

    return evaluator
  }

  private async createCommonEntity(createEvaluatorDto: CreateEvaluatorDto, userId: string): Promise<CommonEntity> {
    const dto = this.transformToCreateCommonEntityDto(createEvaluatorDto, userId)
    const createdCommonEntity = await this.createCommonEntityService.createWithTransaction(dto, this.manager)

    return createdCommonEntity
  }

  private transformToCreateCommonEntityDto(
    createEvaluatorDto: CreateEvaluatorDto,
    userId: string
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
      evaluatorLicense.number = createEvaluatorLicenseDto.number
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
