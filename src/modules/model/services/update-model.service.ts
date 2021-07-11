import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { UpdateModelDto } from '@modules/model/dtos'
import { ModelEntity } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelRepository } from '../repositories/model.repository'

@Injectable()
export class UpdateModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async update(updateModelDto: UpdateModelDto): Promise<ModelEntity> {
    await this.checkModelNameExists(updateModelDto)
    return await this.modelRepository.update(updateModelDto)
  }

  private async checkModelNameExists({
    id,
    name
  }: UpdateModelDto): Promise<void> {
    const hasAnotherModel = await this.modelRepository.checkUpdateName(id, name)

    if (hasAnotherModel) {
      throw new ModelNameAlreadyExistsError()
    }
  }
}
