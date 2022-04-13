import { EvaluatorLicenseNotFoundError } from '@modules/evaluator/errors'
import { EvaluatorLicenseDto } from '@modules/shared/dtos/evaluator'
import { UpdateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { EntityManager, getConnection } from 'typeorm'
import { ModelLevel } from '@modules/model/entities'

export class UpdateEvaluatorLicenseService {
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
    const evaluatorLicense = await this.findEvaluatorLicenseById(updateEvaluatorLicenseDto.id, manager)
    const modelLevel = await this.findModelLevelById(updateEvaluatorLicenseDto.modelLevelId, manager)
    const evaluatorLicenseToUpdate = this.updateEvaluatorLicenseData(
      evaluatorLicense,
      updateEvaluatorLicenseDto,
      modelLevel
    )
    const updatedEvaluatorLicense = manager.save(evaluatorLicenseToUpdate)

    return updatedEvaluatorLicense
  }

  private async findEvaluatorLicenseById(
    evaluatorLicenseId: string,
    manager: EntityManager
  ): Promise<EvaluatorLicense> {
    const evaluatorLicense = await manager.findOne(EvaluatorLicense, {
      where: { id: evaluatorLicenseId },
      relations: ['evaluator', 'modelLevel']
    })

    if (!evaluatorLicense) {
      throw new EvaluatorLicenseNotFoundError()
    }

    return evaluatorLicense
  }

  private async findModelLevelById(modelLevelId: string, manager: EntityManager): Promise<ModelLevel> {
    const modelLevel = await manager.findOne(ModelLevel, { where: { id: modelLevelId } })

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
    evaluatorLicense.type = updateEvaluatorLicenseDto.type
    evaluatorLicense.isActive = true
    evaluatorLicense.modelLevel = modelLevel

    return evaluatorLicense
  }
}
