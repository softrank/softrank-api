import { CreateModelLevelService, UpdateModelProcessService, CreateModelProcessService } from '@modules/model/services'
import { ModelNameAlreadyExistsError, ModelNotFoundError } from '@modules/model/errors'
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
    private readonly createModelProcessService: CreateModelProcessService
  ) {}

  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async update(updateModelDto: UpdateModelDto): Promise<ModelDto> {
    const updatedModel = await getConnection().transaction(async (manager: EntityManager) => {
      return this.updateWithTransaction(updateModelDto, manager)
    })

    return ModelDto.fromEntity(updatedModel)
  }

  public async updateWithTransaction(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<Model> {
    this.setManager(manager)

    const model = await this.findModelById(updateModelDto.id)
    await this.checkModelNameExists(updateModelDto)
    const modelToUpdate = this.updateModelData(model, updateModelDto)
    await manager.save(modelToUpdate)
    await this.createOrUpdateModelLevels(updateModelDto)
    await this.createOrUpdateModelProcesses(updateModelDto)
    const updatedModel = await this.findFullModelById(updateModelDto.id)

    this.cleanManager()

    return updatedModel
  }

  private async findModelById(modelId: string): Promise<Model> {
    const model = this.manager.findOne(Model, { where: { id: modelId } })

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }

  private async checkModelNameExists({ id, name, year }: UpdateModelDto): Promise<void> {
    const model = await this.manager.findOne(Model, { where: { id: Not(id), name, year } })

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

  private async createOrUpdateModelLevels(updateModelDto: UpdateModelDto): Promise<void> {
    const promises = updateModelDto.modelLevels?.map((modelLevelDto) => {
      if (modelLevelDto.id) {
        return this.updateModelLevelService.updateWithTransaction(modelLevelDto, this.manager)
      }
      return this.createModelLevelService.createWithTransaction(modelLevelDto, updateModelDto.id, this.manager)
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async createOrUpdateModelProcesses(updateModelDto: UpdateModelDto): Promise<void> {
    const promises = updateModelDto.modelProcesses?.map((modelProcessDto) => {
      if (modelProcessDto.id) {
        return this.updateModelProcessService.updateWithTransaction(modelProcessDto, this.manager)
      }
      return this.createModelProcessService.createWithTransaction(modelProcessDto, updateModelDto.id, this.manager)
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async findFullModelById(modelId: string): Promise<Model> {
    const model = await this.manager.getCustomRepository(ModelRepository).findFullModelById(modelId)
    return model
  }
}
