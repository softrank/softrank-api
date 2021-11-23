import { ModelProcessAlreadyExistsError, ModelNotFoundError } from '@modules/model/errors'
import { Model } from '@modules/model/entities/model.entity'
import { ModelProcessDto } from '@modules/shared/dtos/model'
import { CreateModelProcessDto } from '@modules/model/dtos'
import { EntityManager, getConnection } from 'typeorm'
import { ModelProcess } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { CreateExpectedResultService } from './create-expected-result.service'

@Injectable()
export class CreateModelProcessService {
  constructor(private readonly createExpectedResultService: CreateExpectedResultService) {}
  public async create(
    createModelProcessDto: CreateModelProcessDto,
    modelId: string
  ): Promise<ModelProcessDto> {
    const createdModelProcess = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createModelProcessDto, modelId, manager)
    })

    const modelProcessDto = this.transformToCreateModelProcessDto(createdModelProcess)
    return modelProcessDto
  }

  public async createWithTransaction(
    createModelProcessDto: CreateModelProcessDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelProcess> {
    const model = await this.findModelById(modelId, manager)
    await this.verifyModelProcessConflicts(createModelProcessDto, modelId, manager)
    const modelProcessToCreate = this.buildModelProcessData(createModelProcessDto, model)
    const createdModelProcess = await manager.save(modelProcessToCreate)
    await this.createOrUpdateExpectedResults(createdModelProcess.id, createModelProcessDto, manager)

    return createdModelProcess
  }

  private async findModelById(modelId: string, manager: EntityManager): Promise<Model> {
    const model = await manager.findOne(Model, { where: { id: modelId } })

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }

  private async verifyModelProcessConflicts(
    createModelProcessDto: CreateModelProcessDto,
    modelId: string,
    manager: EntityManager
  ): Promise<void | never> {
    const modelProcess = await manager.findOne(ModelProcess, {
      where: {
        name: createModelProcessDto.name,
        initial: createModelProcessDto.initial,
        model: modelId
      }
    })

    if (modelProcess) {
      throw new ModelProcessAlreadyExistsError()
    }
  }

  private buildModelProcessData(createModelProcessDto: CreateModelProcessDto, model: Model): ModelProcess {
    const modelProcess = new ModelProcess()

    modelProcess.initial = createModelProcessDto.initial
    modelProcess.name = createModelProcessDto.name
    modelProcess.description = createModelProcessDto.description
    modelProcess.model = model

    return modelProcess
  }

  private async createOrUpdateExpectedResults(
    modelProcessId: string,
    createModelProcessDto: CreateModelProcessDto,
    manager: EntityManager
  ): Promise<void> {
    const expectedResultPromises = createModelProcessDto.expectedResults?.map((expectedResult) => {
      return this.createExpectedResultService.createWithTransaction(expectedResult, modelProcessId, manager)
    })

    if (expectedResultPromises?.length) {
      await Promise.all(expectedResultPromises)
    }
  }

  private transformToCreateModelProcessDto(modelProcess: ModelProcess): ModelProcessDto {
    return ModelProcessDto.fromEntity(modelProcess)
  }
}
