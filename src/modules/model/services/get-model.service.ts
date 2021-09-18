import { ModelNotFoundError } from '@modules/model/errors'
import { ModelEntity } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelRepository } from '@modules/model/repositories'

@Injectable()
export class GetModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async listModels(): Promise<ModelEntity[]> {
    return await this.modelRepository.listModels()
  }

  async getById(id: string): Promise<ModelEntity> {
    const model = await this.modelRepository.findById(id)

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }
}
