import { EntityRepository, Repository } from 'typeorm'
import { Model } from '../entities/model.entity'

@EntityRepository(Model)
export class ModelRepository extends Repository<Model> {
  public async findFullModelById(modelId: string): Promise<Model> {
    const model = this.findOne({
      where: { id: modelId },
      relations: ['modelProcesses', 'modelLevels']
    })

    return model
  }
}
