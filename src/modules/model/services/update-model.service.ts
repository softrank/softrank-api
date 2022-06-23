import {
  CreateModelLevelService,
  UpdateModelProcessService,
  CreateModelProcessService,
  UpdateModelCapacityService
} from '@modules/model/services'
import { ModelNameAlreadyExistsError, ModelNotFoundError } from '@modules/model/errors'
import { CreateModelCapacityService } from './create-model-capacity.service'
import { UpdateModelLevelService } from '@modules/model/services'
import { ModelRepository } from '@modules/model/repositories'
import { EntityManager, getConnection, Not } from 'typeorm'
import { ModelDto } from '@modules/shared/dtos/model'
import { UpdateModelDto } from '@modules/model/dtos'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateModelService {
  constructor(
    private readonly updateModelLevelService: UpdateModelLevelService,
    private readonly createModelLevelService: CreateModelLevelService,
    private readonly updateModelProcessService: UpdateModelProcessService,
    private readonly createModelProcessService: CreateModelProcessService,
    private readonly updateModelCapacityService: UpdateModelCapacityService,
    private readonly createModelCapacityService: CreateModelCapacityService
  ) {}

  public async update(updateModelDto: UpdateModelDto): Promise<ModelDto> {
    const updatedModel = await getConnection().transaction(async (manager: EntityManager) => {
      return this.updateWithTransaction(updateModelDto, manager)
    })

    return ModelDto.fromEntity(updatedModel)
  }

  public async updateWithTransaction(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<Model> {
    const model = await this.findModelById(updateModelDto.id, manager)
    await this.checkModelNameExists(updateModelDto, manager)
    const modelToUpdate = this.updateModelData(model, updateModelDto)
    await manager.save(modelToUpdate)
    await this.createOrUpdateModelLevels(updateModelDto, manager)
    await this.createOrUpdateModelProcesses(updateModelDto, manager)
    await this.createOrUpdateModelCapacities(updateModelDto, manager)
    const updatedModel = await this.findFullModelById(updateModelDto.id, manager)

    return updatedModel
  }

  private async findModelById(modelId: string, manager: EntityManager): Promise<Model> {
    const model = manager.findOne(Model, { where: { id: modelId } })

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }

  private async checkModelNameExists({ id, name, year }: UpdateModelDto, manager: EntityManager): Promise<void> {
    const model = await manager.findOne(Model, { where: { id: Not(id), name, year } })

    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private updateModelData(model: Model, updateModelDto: UpdateModelDto): Model {
    model.name = updateModelDto.name
    model.year = updateModelDto.year
    model.description = updateModelDto.description

    return model
  }

  private async createOrUpdateModelLevels(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<void> {
    const promises = updateModelDto.modelLevels?.map((modelLevelDto) => {
      if (modelLevelDto.id) {
        return this.updateModelLevelService.updateWithTransaction(modelLevelDto, manager)
      }
      return this.createModelLevelService.createWithTransaction(modelLevelDto, updateModelDto.id, manager)
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async createOrUpdateModelProcesses(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<void> {
    const promises = updateModelDto.modelProcesses?.map((modelProcessDto) => {
      if (modelProcessDto.id) {
        return this.updateModelProcessService.updateWithTransaction(modelProcessDto, manager)
      }
      return this.createModelProcessService.createWithTransaction(modelProcessDto, updateModelDto.id, manager)
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async createOrUpdateModelCapacities(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<void> {
    const promises = updateModelDto.modelCapacities?.map((modelCapacityDto) => {
      if (modelCapacityDto.id) {
        return this.updateModelCapacityService.updateWithTransaction(modelCapacityDto, updateModelDto.id, manager)
      }
      return this.createModelCapacityService.createWithTransaction(modelCapacityDto, updateModelDto.id, manager)
    })

    if (promises.length) {
      await Promise.all(promises)
    }
  }

  private async findFullModelById(modelId: string, manager: EntityManager): Promise<Model> {
    const model = await manager.getCustomRepository(ModelRepository).findFullModelById(modelId)
    return model
  }
}
