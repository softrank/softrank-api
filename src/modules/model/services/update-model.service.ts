import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { ModelRepository } from '@modules/model/repositories'
import { ModelEntity } from '@modules/model/entities'
import { UpdateModelDto } from '@modules/model/dtos'
import { Injectable } from '@nestjs/common'
import { ModelNotFoundError } from '../errors/model-not-found.error'

@Injectable()
export class UpdateModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async update(updateModelDto: UpdateModelDto): Promise<ModelEntity> {
    await this.checkModelExceptions(updateModelDto)
    const updatingModel = this.buildModel(updateModelDto)
    return await this.modelRepository.update(updatingModel)
  }

  private async checkModelExceptions({
    id,
    name
  }: UpdateModelDto): Promise<void> {
    const model = await this.modelRepository.findById(id)

    if (!model) {
      throw new ModelNotFoundError()
    }

    const hasAnotherModel = await this.modelRepository.checkUpdateName(id, name)

    if (hasAnotherModel) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private buildModel(updateModelDto: UpdateModelDto): ModelEntity {
    return UpdateModelDto.toEntity(updateModelDto)
  }
}
