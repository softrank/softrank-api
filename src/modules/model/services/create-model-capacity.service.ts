import { ModelLevelNotFoundError, ModelNotFoundError } from '../errors'
import { Model, ModelCapacity, ModelLevel } from '../entities'
import { ModelRepository } from '../repositories'
import { CreateModelCapacityDto } from '../dtos'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'

@Injectable()
export class CreateModelCapacityService {
  constructor(private readonly modelRepository: ModelRepository) {}

  // public async create(createModelCapacityDto: CreateModelCapacityDto, modelId: string): Promise<any> {}

  public async createWithTransaction(
    createModelCapacityDto: CreateModelCapacityDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelCapacity> {
    const modelCapacity = await this.buildModelCapacityEntity(createModelCapacityDto, modelId, manager)
    const insertedModelCapacity = await manager.save(modelCapacity)

    return insertedModelCapacity
  }

  private async buildModelCapacityEntity(
    createModelCapacityDto: CreateModelCapacityDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelCapacity> {
    const model = await this.findModelById(modelId)
    const minModelLevel = await this.findModelLevelByInitial(createModelCapacityDto.minLevel, modelId, manager)
    const maxModelLevel = await this.findModelLevelByInitial(createModelCapacityDto.maxLevel, modelId, manager)
    const modelCapacity = new ModelCapacity()

    modelCapacity.name = createModelCapacityDto.name
    modelCapacity.type = createModelCapacityDto.type
    modelCapacity.minModelLevel = minModelLevel
    modelCapacity.maxModelLevel = maxModelLevel
    modelCapacity.model = model

    return modelCapacity
  }

  private async findModelLevelByInitial(initial: string, modelId: string, manager: EntityManager): Promise<ModelLevel> {
    const modelLevel = await manager
      .createQueryBuilder(ModelLevel, 'modelLevel')
      .where('modelLevel.model = :modelId')
      .andWhere('modelLevel.initial = :initial')
      .setParameters({ modelId, initial })
      .getOne()

    if (!modelLevel) {
      throw new ModelLevelNotFoundError(`Nível ${initial} não encontrado.`)
    }

    return modelLevel
  }

  private async findModelById(modelId: string): Promise<Model> {
    const model = await this.modelRepository.createQueryBuilder('model').where('model.id = :modelId').setParameters({ modelId }).getOne()

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }
}
