import { ModelCapacityNotFound, ModelLevelNotFoundError, ModelNotFoundError } from '../errors'
import { Model, ModelCapacity, ModelLevel } from '../entities'
import { ModelRepository } from '../repositories'
import { UpdateModelCapacityDto } from '../dtos'
import { Injectable } from '@nestjs/common'
import { EntityManager, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UpdateModelCapacityService {
  constructor(
    @InjectRepository(ModelCapacity)
    private readonly modelCapacityRepository: Repository<ModelCapacity>,
    private readonly modelRepository: ModelRepository
  ) {}

  // public async update(updateModelCapacityDto: updateModelCapacityDto, modelId: string): Promise<any> {}

  public async updateWithTransaction(
    updateModelCapacityDto: UpdateModelCapacityDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelCapacity> {
    const modelCapacity = await this.findModelCapacityById(updateModelCapacityDto.id)
    const modelCapacityToUpdate = await this.buildModelCapacityEntity(modelCapacity, updateModelCapacityDto, modelId, manager)
    const updatedModelCapacity = await manager.save(modelCapacityToUpdate)

    return updatedModelCapacity
  }

  private async findModelCapacityById(modelCapacityId: string): Promise<ModelCapacity> {
    const modelCapacity = await this.modelCapacityRepository
      .createQueryBuilder('modelCapacity')
      .where('modelCapacity.id = :modelCapacityId')
      .setParameters({ modelCapacityId })
      .getOne()

    if (!modelCapacity) {
      throw new ModelCapacityNotFound('Capacidade do modelo não encontrado para atualização.')
    }

    return modelCapacity
  }

  private async buildModelCapacityEntity(
    modelCapacity: ModelCapacity,
    updateModelCapacityDto: UpdateModelCapacityDto,
    modelId: string,
    manager: EntityManager
  ): Promise<ModelCapacity> {
    const model = await this.findModelById(modelId)
    const minModelLevel = await this.findModelLevelByInitial(updateModelCapacityDto.minLevel, modelId, manager)
    const maxModelLevel = await this.findModelLevelByInitial(updateModelCapacityDto.maxLevel, modelId, manager)

    modelCapacity.name = updateModelCapacityDto.name
    modelCapacity.type = updateModelCapacityDto.type
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
