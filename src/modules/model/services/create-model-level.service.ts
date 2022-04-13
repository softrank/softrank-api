import { Injectable } from '@nestjs/common'
import { CreateModelLevelDto } from '../dtos'
import { ModelLevelDto } from '../../shared/dtos/model/model-level.dto'
import { getConnection, EntityManager } from 'typeorm'
import { Model, ModelLevel } from '../entities'
import { ModelNotFoundError } from '../errors/model-not-found.error'
import { ModelLevelAlreadyExistsError } from '../errors'

@Injectable()
export class CreateModelLevelService {
  public async create(createModelLevelDto: CreateModelLevelDto, modelId: string): Promise<ModelLevelDto> {
    const createdModelLevel = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createModelLevelDto, modelId, manager)
    })

    const modelLevelDto = this.transformToDto(createdModelLevel)
    return modelLevelDto
  }

  public async createWithTransaction(
    createModelLevelDto: CreateModelLevelDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelLevel> {
    await this.checkModelLevelConflicts(createModelLevelDto, modelId, manager)
    const model = await this.findModelById(modelId, manager)
    const modelLevelToCreate = this.buildModelLevelEntity(model, createModelLevelDto)
    const createdModelLevel = await manager.save(modelLevelToCreate)

    return createdModelLevel
  }

  private async findModelById(modelLevelId: string, manager: EntityManager): Promise<Model> {
    const modelLevel = await manager.findOne(Model, { where: { id: modelLevelId } })

    if (!modelLevel) {
      throw new ModelNotFoundError()
    }

    return modelLevel
  }

  private async checkModelLevelConflicts(
    createModelLevelDto: CreateModelLevelDto,
    modelId: string,
    manager: EntityManager
  ): Promise<void | never> {
    const conflictedModelLevel = await manager.findOne(ModelLevel, {
      where: {
        initial: createModelLevelDto.initial,
        name: createModelLevelDto.name,
        model: modelId
      }
    })

    if (conflictedModelLevel) {
      throw new ModelLevelAlreadyExistsError()
    }
  }

  private buildModelLevelEntity(model: Model, createModelLevelDto: CreateModelLevelDto): ModelLevel {
    const modelLevel = new ModelLevel()

    modelLevel.initial = createModelLevelDto.initial
    modelLevel.name = createModelLevelDto.name
    modelLevel.predecessor = createModelLevelDto.predecessor
    modelLevel.model = model

    return modelLevel
  }

  private transformToDto(modelLevel: ModelLevel): ModelLevelDto {
    return ModelLevelDto.fromEntity(modelLevel)
  }
}
