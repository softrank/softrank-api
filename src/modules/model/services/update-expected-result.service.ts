import { ExpectedResultNotFoundError, ExpectedResultAlreadyExistsError } from '@modules/model/errors'
import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { UpdateExpectedResultDto } from '@modules/model/dtos'
import { EntityManager, getConnection, Not } from 'typeorm'
import { ExpectedResult } from '@modules/model/entities'

export class UpdateExpectedResultService {
  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

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
    this.setManager(manager)

    const expectedResult = await this.findExpectedResultById(updateExpectedResultDto.id)
    await this.verifyExpectedResultConflicts(updateExpectedResultDto, expectedResult.modelProcess.id)
    const expectedResultToUpdate = this.updateExpectedResultData(expectedResult, updateExpectedResultDto)
    const updatedExpectedResult = await this.manager.save(expectedResultToUpdate)

    this.cleanManager()

    return updatedExpectedResult
  }

  private async findExpectedResultById(expectedResultId: string): Promise<ExpectedResult> {
    const expectedResult = await this.manager.findOne(ExpectedResult, {
      where: { id: expectedResultId },
      relations: ['modelProcess']
    })

    if (!expectedResult) {
      throw new ExpectedResultNotFoundError()
    }

    return expectedResult
  }

  private async verifyExpectedResultConflicts(
    updateExpectedResultDto: UpdateExpectedResultDto,
    modelProcessId: string
  ): Promise<void | never> {
    const expectedResult = await this.manager.findOne(ExpectedResult, {
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
    expectedResult.initial = updateExpectedResultDto.initial
    expectedResult.name = updateExpectedResultDto.name
    expectedResult.maxLevel = updateExpectedResultDto.maxLevel
    expectedResult.minLevel = updateExpectedResultDto.minLevel
    expectedResult.description = updateExpectedResultDto.description

    return expectedResult
  }
}
