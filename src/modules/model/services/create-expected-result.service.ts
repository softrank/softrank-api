import { ExpectedResultAlreadyExistsError } from '@modules/model/errors'
import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { CreateExpectedResultDto } from '@modules/model/dtos'
import { EntityManager, getConnection } from 'typeorm'
import { ExpectedResult } from '@modules/model/entities'
import { ModelProcess } from '../entities/model-process.entity'
import { ModelProcessNotFoundError } from '../errors/model-process.errors'
import { Model } from '../entities/model.entity'
import { ModelLevel } from '../entities/model-level.entity'
import { ModelLevelNotFoundError } from '../errors/model-level.errors'

export class CreateExpectedResultService {
  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(
    createExpectedResultDto: CreateExpectedResultDto,
    modelProcessId: string
  ): Promise<ExpectedResultDto> {
    const createdExpectedResult = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createExpectedResultDto, modelProcessId, manager)
    })

    const expectedResultDto = this.transformToExpectedResultDto(createdExpectedResult)
    return expectedResultDto
  }

  public async createWithTransaction(
    createExpectedResultDto: CreateExpectedResultDto,
    modelProcessId: string,
    manager: EntityManager
  ): Promise<ExpectedResult> {
    this.setManager(manager)
    const modelProcess = await this.findExpectedResultById(modelProcessId)
    await this.verifyExpectedResultConflicts(createExpectedResultDto, modelProcessId)
    const expectedResultToCreate = this.buildExpectedResultData(createExpectedResultDto, modelProcess)
    const createdExpectedResult = await this.manager.save(expectedResultToCreate)
    this.cleanManager()

    return createdExpectedResult
  }

  private async findExpectedResultById(modelProcessId: string): Promise<ModelProcess> {
    const modelProcess = await this.manager
      .createQueryBuilder(ModelProcess, 'modelProcess')
      .leftJoinAndSelect('modelProcess.model', 'model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .where('modelProcess.id = :modelProcessId', { modelProcessId })
      .getOne()

    if (!modelProcess) {
      throw new ModelProcessNotFoundError()
    }

    return modelProcess
  }

  private async verifyExpectedResultConflicts(
    createExpectedResultDto: CreateExpectedResultDto,
    modelProcessId: string
  ): Promise<void | never> {
    const expectedResult = await this.manager.findOne(ExpectedResult, {
      where: {
        initial: createExpectedResultDto.initial,
        name: createExpectedResultDto.name,
        modelProcess: modelProcessId
      }
    })

    if (expectedResult) {
      throw new ExpectedResultAlreadyExistsError()
    }
  }

  private buildExpectedResultData(
    createExpectedResultDto: CreateExpectedResultDto,
    modelProcess: ModelProcess
  ): ExpectedResult {
    const maxLevel = this.getModelLevelByInitial(modelProcess.model, createExpectedResultDto.maxLevel)
    const minLevel = this.getModelLevelByInitial(modelProcess.model, createExpectedResultDto.minLevel)
    const expectedResult = new ExpectedResult()

    expectedResult.initial = createExpectedResultDto.initial
    expectedResult.name = createExpectedResultDto.name
    expectedResult.maxLevel = maxLevel
    expectedResult.minLevel = minLevel
    expectedResult.description = createExpectedResultDto.description
    expectedResult.modelProcess = modelProcess

    return expectedResult
  }

  private getModelLevelByInitial(model: Model, initial: string): ModelLevel {
    const modelLevel = model?.modelLevels?.find((modelLevel) => modelLevel.initial === initial)

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private transformToExpectedResultDto(expectedResult: ExpectedResult): ExpectedResultDto {
    return ExpectedResultDto.fromEntity(expectedResult)
  }
}
