import { ExpectedResultAlreadyExistsError } from '@modules/model/errors'
import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { CreateExpectedResultDto } from '@modules/model/dtos'
import { EntityManager, getConnection } from 'typeorm'
import { ExpectedResult } from '@modules/model/entities'
import { ModelProcess } from '../entities/model-process.entity'
import { ModelProcessNotFoundError } from '../errors/model-process.errors'

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
    const modelProcess = await this.manager.findOne(ModelProcess, { where: { id: modelProcessId } })

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
    const expectedResult = new ExpectedResult()

    expectedResult.initial = createExpectedResultDto.initial
    expectedResult.name = createExpectedResultDto.name
    expectedResult.maxLevel = createExpectedResultDto.maxLevel
    expectedResult.minLevel = createExpectedResultDto.minLevel
    expectedResult.description = createExpectedResultDto.description
    expectedResult.modelProcess = modelProcess

    return expectedResult
  }

  private transformToExpectedResultDto(expectedResult: ExpectedResult): ExpectedResultDto {
    return ExpectedResultDto.fromEntity(expectedResult)
  }
}
