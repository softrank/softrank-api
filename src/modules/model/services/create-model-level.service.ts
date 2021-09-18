import { Injectable } from '@nestjs/common'
import { CreateModelLevelDto } from '../dtos'
import { ModelLevelDto } from '../../shared/dtos/model/model-level.dto'
import { getConnection, EntityManager } from 'typeorm'
import { Model, ModelLevel } from '../entities'
import { ModelNotFoundError } from '../errors/model-not-found.error'
import { ModelLevelAlreadyExistsError } from '../errors'

@Injectable()
export class CreateModelLevelService {
  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

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
    this.setManager(manager)

    await this.checkModelLevelConflicts(createModelLevelDto, modelId)
    const model = await this.findModelById(modelId)
    const modelLevelToCreate = this.buildModelLevelEntity(model, createModelLevelDto)
    const createdModelLevel = await this.manager.save(modelLevelToCreate)

    this.cleanManager()
    return createdModelLevel
  }

  private async findModelById(modelLevelId: string): Promise<Model> {
    const modelLevel = await this.manager.findOne(Model, { where: { id: modelLevelId } })

    if (!modelLevel) {
      throw new ModelNotFoundError()
    }

    return modelLevel
  }

  private async checkModelLevelConflicts(
    createModelLevelDto: CreateModelLevelDto,
    modelId: string
  ): Promise<void | never> {
    const conflictedModelLevel = await this.manager.findOne(ModelLevel, {
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
