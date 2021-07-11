import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { ModelRepository } from '@modules/model/repositories'
import { ModelEntity } from '@modules/model/entities'
import { CreateModelDto } from '@modules/model/dtos'
import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

@Injectable()
export class CreateModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async create(createModelDto: CreateModelDto): Promise<ModelEntity> {
    await this.checkModelNameExists(createModelDto.name)
    const model = this.createModel(createModelDto)

    return await this.modelRepository.create(model)
  }

  private async checkModelNameExists(name: string): Promise<void> {
    const model = await this.modelRepository.findByName(name)

    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private createModel(createModelDto: CreateModelDto): ModelEntity {
    const model = new ModelEntity()

    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description

    return model
  }
}
