import { CreateExpectedResultService, UpdateExpectedResultService } from '@modules/model/services'
import { ModelProcessNotFoundError, ModelProcessAlreadyExistsError } from '@modules/model/errors'
import { ModelProcessDto } from '@modules/shared/dtos/model'
import { EntityManager, getConnection, Not } from 'typeorm'
import { UpdateModelProcessDto } from '@modules/model/dtos'
import { ModelProcess } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateModelProcessService {
  constructor(
    private readonly createExpectedResultService: CreateExpectedResultService,
    private readonly updateExpectedResultService: UpdateExpectedResultService
  ) {}

  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async update(updateModelProcessDto: UpdateModelProcessDto): Promise<ModelProcessDto> {
    const updatedModelProcess = await getConnection().transaction((manager: EntityManager) => {
      return this.updateWithTransaction(updateModelProcessDto, manager)
    })

    return ModelProcessDto.fromEntity(updatedModelProcess)
  }

  public async updateWithTransaction(
    updateModelProcessDto: UpdateModelProcessDto,
    manager: EntityManager
  ): Promise<ModelProcess> {
    this.setManager(manager)

    const modelProcess = await this.findModelProcessById(updateModelProcessDto.id)
    await this.verifyModelProcessConflicts(updateModelProcessDto, modelProcess.model.id)
    const modelProcessToUpdate = this.updateModelProcessData(modelProcess, updateModelProcessDto)
    const updatedModelProcess = await this.manager.save(modelProcessToUpdate)
    await this.createOrUpdateExpectedResults(updateModelProcessDto)

    this.cleanManager()

    return updatedModelProcess
  }

  private async findModelProcessById(modelProcessId: string): Promise<ModelProcess> {
    const modelProcess = await this.manager.findOne(ModelProcess, {
      where: { id: modelProcessId },
      relations: ['model']
    })

    if (!modelProcess) {
      throw new ModelProcessNotFoundError()
    }

    return modelProcess
  }

  private async verifyModelProcessConflicts(
    updateModelProcessDto: UpdateModelProcessDto,
    modelId: string
  ): Promise<void | never> {
    const modelProcess = await this.manager.findOne(ModelProcess, {
      where: {
        id: Not(updateModelProcessDto.id),
        name: updateModelProcessDto.name,
        initial: updateModelProcessDto.initial,
        model: modelId
      }
    })

    if (modelProcess) {
      throw new ModelProcessAlreadyExistsError()
    }
  }

  private updateModelProcessData(
    modelProcess: ModelProcess,
    updateModelProcessDto: UpdateModelProcessDto
  ): ModelProcess {
    modelProcess.initial = updateModelProcessDto.initial
    modelProcess.name = updateModelProcessDto.name
    modelProcess.description = updateModelProcessDto.description

    return modelProcess
  }

  private async createOrUpdateExpectedResults(updateModelProcessDto: UpdateModelProcessDto): Promise<void> {
    const promises = updateModelProcessDto.expectedResults.map((expectedResultDto) => {
      if (expectedResultDto.id) {
        return this.updateExpectedResultService.updateWithTransaction(expectedResultDto, this.manager)
      }
      return this.createExpectedResultService.createWithTransaction(
        expectedResultDto,
        updateModelProcessDto.id,
        this.manager
      )
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }
}
