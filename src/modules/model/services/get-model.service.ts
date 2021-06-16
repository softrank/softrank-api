import { ModelNotFoundError } from '@modules/model/errors'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class GetModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}

  async listModels(): Promise<Model[]> {
    const models = await this.modelRepository.find()

    return models
  }

  async getById(id: string) {
    const model = await this.modelRepository.findOne({ where: { id } })

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }
}
