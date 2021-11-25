import { ExpectedResultNotFoundError, ExpectedResultAlreadyExistsError } from '@modules/model/errors'
import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { UpdateExpectedResultDto } from '@modules/model/dtos'
import { EntityManager, getConnection, Not } from 'typeorm'
import { ExpectedResult } from '@modules/model/entities'
import { Model } from '../entities/model.entity'
import { ModelLevel } from '../entities/model-level.entity'
import { ModelLevelNotFoundError } from '../errors/model-level.errors'

export class UpdateExpectedResultService {
  public async update(updateExpectedResultDto: UpdateExpectedResultDto): Promise<ExpectedResultDto> {
    const updatedExpectedResult = await getConnection().transaction((manager: EntityManager) => {
      return this.updateWithTransaction(updateExpectedResultDto, manager)
    })

    return ExpectedResultDto.fromEntity(updatedExpectedResult)
  }

  public async updateWithTransaction(
    updateExpectedResultDto: UpdateExpectedResultDto,
    manager: EntityManager
  ): Promise<ExpectedResult> {
    const expectedResult = await this.findExpectedResultById(updateExpectedResultDto.id, manager)
    await this.verifyExpectedResultConflicts(updateExpectedResultDto, expectedResult.modelProcess.id, manager)
    const expectedResultToUpdate = this.updateExpectedResultData(expectedResult, updateExpectedResultDto)
    const updatedExpectedResult = await manager.save(expectedResultToUpdate)

    return updatedExpectedResult
  }

  private async findExpectedResultById(
    expectedResultId: string,
    manager: EntityManager
  ): Promise<ExpectedResult> {
    const expectedResult = await manager
      .createQueryBuilder(ExpectedResult, 'expectedResult')
      .leftJoinAndSelect('expectedResult.modelProcess', 'modelProcess')
      .leftJoinAndSelect('modelProcess.model', 'model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .where('expectedResult.id = :expectedResultId', { expectedResultId })
      .getOne()

    if (!expectedResult) {
      throw new ExpectedResultNotFoundError()
    }

    return expectedResult
  }

  private async verifyExpectedResultConflicts(
    updateExpectedResultDto: UpdateExpectedResultDto,
    modelProcessId: string,
    manager: EntityManager
  ): Promise<void | never> {
    const expectedResult = await manager.findOne(ExpectedResult, {
      where: {
        id: Not(updateExpectedResultDto.id),
        initial: updateExpectedResultDto.initial,
        name: updateExpectedResultDto.name,
        modelProcess: modelProcessId
      }
    })

    if (expectedResult) {
      throw new ExpectedResultAlreadyExistsError()
    }
  }

  private updateExpectedResultData(
    expectedResult: ExpectedResult,
    updateExpectedResultDto: UpdateExpectedResultDto
  ): ExpectedResult {
    const maxLevel =
      updateExpectedResultDto.maxLevel &&
      this.getModelLevelByInitial(expectedResult.modelProcess.model, updateExpectedResultDto.maxLevel)

    const minLevel = this.getModelLevelByInitial(
      expectedResult.modelProcess.model,
      updateExpectedResultDto.minLevel
    )

    expectedResult.name = updateExpectedResultDto.name
    expectedResult.maxLevel = maxLevel
    expectedResult.minLevel = minLevel
    expectedResult.description = updateExpectedResultDto.description

    return expectedResult
  }

  private getModelLevelByInitial(model: Model, initial: string): ModelLevel {
    const modelLevel = model?.modelLevels?.find((modelLevel) => modelLevel.initial === initial)

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }
}
