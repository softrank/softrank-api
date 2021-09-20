import { EvaluatorLicenseAlreadyExistsError, EvaluatorLicenseNotFoundError } from '@modules/evaluator/errors'
import { EvaluatorLicenseDto } from '@modules/shared/dtos/evaluator'
import { UpdateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { EntityManager, getConnection, Not } from 'typeorm'
import { ModelLevel } from '@modules/model/entities'

export class UpdateEvaluatorLicenseService {
  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async update(updateEvaluatorLicenseDto: UpdateEvaluatorLicenseDto): Promise<EvaluatorLicenseDto> {
    const updatedEvaluatorLicense = await getConnection().transaction((manager: EntityManager) => {
      return this.updateWithTransaction(updateEvaluatorLicenseDto, manager)
    })
    return EvaluatorLicenseDto.fromEntity(updatedEvaluatorLicense)
  }

  public async updateWithTransaction(
    updateEvaluatorLicenseDto: UpdateEvaluatorLicenseDto,
    manager: EntityManager
  ): Promise<EvaluatorLicense> {
    this.setManager(manager)

    const evaluatorLicense = await this.findEvaluatorLicenseById(updateEvaluatorLicenseDto.id)
    await this.verifyEvaluatorLicensesConflicts(updateEvaluatorLicenseDto)
    const modelLevel = await this.findModelLevelById(updateEvaluatorLicenseDto.modelLevelId)
    const evaluatorLicenseToUpdate = this.updateEvaluatorLicenseData(
      evaluatorLicense,
      updateEvaluatorLicenseDto,
      modelLevel
    )
    const updatedEvaluatorLicense = this.manager.save(evaluatorLicenseToUpdate)

    this.cleanManager()
    return updatedEvaluatorLicense
  }

  private async findEvaluatorLicenseById(evaluatorLicenseId: string): Promise<EvaluatorLicense> {
    const evaluatorLicense = await this.manager.findOne(EvaluatorLicense, {
      where: { id: evaluatorLicenseId },
      relations: ['evaluator', 'modelLevel']
    })

    if (!evaluatorLicense) {
      throw new EvaluatorLicenseNotFoundError()
    }

    return evaluatorLicense
  }

  private async verifyEvaluatorLicensesConflicts(
    updateEvaluatorLicenseDto: UpdateEvaluatorLicenseDto
  ): Promise<void | never> {
    const evaluatorLicense = await this.manager.findOne(EvaluatorLicense, {
      where: { id: Not(updateEvaluatorLicenseDto.id), number: updateEvaluatorLicenseDto.number }
    })

    if (evaluatorLicense) {
      throw new EvaluatorLicenseAlreadyExistsError()
    }
  }

  private async findModelLevelById(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.manager.findOne(ModelLevel, { where: { id: modelLevelId } })

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private updateEvaluatorLicenseData(
    evaluatorLicense: EvaluatorLicense,
    updateEvaluatorLicenseDto: UpdateEvaluatorLicenseDto,
    modelLevel: ModelLevel
  ): EvaluatorLicense {
    evaluatorLicense.expiration = updateEvaluatorLicenseDto.expiration
    evaluatorLicense.number = updateEvaluatorLicenseDto.number
    evaluatorLicense.isActive = true
    evaluatorLicense.modelLevel = modelLevel

    return evaluatorLicense
  }
}
