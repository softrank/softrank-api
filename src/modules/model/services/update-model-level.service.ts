import { ModelLevelNotFoundError, ModelLevelAlreadyExistsError } from '@modules/model/errors'
import { getConnection, EntityManager, Not } from 'typeorm'
import { ModelLevelDto } from '@modules/shared/dtos/model'
import { UpdateModelLevelDto } from '@modules/model/dtos'
import { ModelLevel } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateModelLevelService {
  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async update(updateModelLevelDto: UpdateModelLevelDto): Promise<ModelLevelDto> {
    const updatedModelLevel = await getConnection().transaction((manager: EntityManager) => {
      return this.updateWithTransaction(updateModelLevelDto, manager)
    })

    return ModelLevelDto.fromEntity(updatedModelLevel)
  }

  public async updateWithTransaction(
    updateModelLevelDto: UpdateModelLevelDto,
    manager: EntityManager
  ): Promise<ModelLevel> {
    this.setManager(manager)

    const modelLevel = await this.findModelLevelById(updateModelLevelDto.id)
    await this.checkModelLevelConflicts(updateModelLevelDto, modelLevel.model.id)
    const modelLevelToUpdate = this.updateModelLevelData(modelLevel, updateModelLevelDto)
    const updatedModelLevel = await this.manager.save(modelLevelToUpdate)

    this.cleanManager()
    return updatedModelLevel
  }

  private async findModelLevelById(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.manager.findOne(ModelLevel, { where: { id: modelLevelId }, relations: ['model'] })

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private async checkModelLevelConflicts(
    updateModelLevelDto: UpdateModelLevelDto,
    modelId: string
  ): Promise<void | never> {
    const conflictedModelLevel = await this.manager.findOne(ModelLevel, {
      where: {
        id: Not(updateModelLevelDto.id),
        initial: updateModelLevelDto.initial,
        name: updateModelLevelDto.name,
        model: modelId
      }
    })

    if (conflictedModelLevel) {
      throw new ModelLevelAlreadyExistsError()
    }
  }

  private updateModelLevelData(modelLevel: ModelLevel, updateModelLevelDto: UpdateModelLevelDto): ModelLevel {
    modelLevel.initial = updateModelLevelDto.initial
    modelLevel.name = updateModelLevelDto.name
    modelLevel.predecessor = updateModelLevelDto.predecessor

    return modelLevel
  }
}
