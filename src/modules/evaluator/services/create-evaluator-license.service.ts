import { EvaluatorLicense, Evaluator } from '@modules/evaluator/entities'
import { EvaluatorLicenseDto } from '@modules/shared/dtos/evaluator'
import { CreateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { EvaluatorNotFoundError } from '@modules/evaluator/errors'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { EntityManager, getConnection } from 'typeorm'
import { ModelLevel } from '@modules/model/entities'

export class CreateEvaluatorLicenseService {
  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(
    createEvaluatorLicenseDto: CreateEvaluatorLicenseDto,
    evaluatorId: string
  ): Promise<EvaluatorLicenseDto> {
    const createdEvaluatorLicense = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluatorLicenseDto, evaluatorId, manager)
    })
    return EvaluatorLicenseDto.fromEntity(createdEvaluatorLicense)
  }

  public async createWithTransaction(
    createEvaluatorLicenseDto: CreateEvaluatorLicenseDto,
    evaluatorId: string,
    manager: EntityManager
  ): Promise<EvaluatorLicense> {
    this.setManager(manager)

    const evaluator = await this.findEvaluatorById(evaluatorId)
    const modelLevel = await this.findModelLevelById(createEvaluatorLicenseDto.modelLevelId)
    const evaluatorLicenseToCreate = this.buildEvaluatorLicenseEntity(
      createEvaluatorLicenseDto,
      evaluator,
      modelLevel
    )
    const createdEvaluatorLicense = this.manager.save(evaluatorLicenseToCreate)

    this.cleanManager()
    return createdEvaluatorLicense
  }

  private async findModelLevelById(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.manager.findOne(ModelLevel, { where: { id: modelLevelId } })

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private async findEvaluatorById(evaluatorId: string): Promise<Evaluator> {
    const evaluator = await this.manager.findOne(Evaluator, { where: { id: evaluatorId } })

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }

  private buildEvaluatorLicenseEntity(
    createEvaluatorLicenseDto: CreateEvaluatorLicenseDto,
    evaluator: Evaluator,
    modelLevel: ModelLevel
  ): EvaluatorLicense {
    const evaluatorLicense = new EvaluatorLicense()

    evaluatorLicense.expiration = createEvaluatorLicenseDto.expiration
    evaluatorLicense.isActive = true
    evaluatorLicense.modelLevel = modelLevel
    evaluatorLicense.evaluator = evaluator

    return evaluatorLicense
  }
}
