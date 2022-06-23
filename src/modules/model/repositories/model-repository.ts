import { EntityRepository, Repository } from 'typeorm'
import { Model } from '../entities/model.entity'

@EntityRepository(Model)
export class ModelRepository extends Repository<Model> {
  public async findFullModelById(modelId: string): Promise<Model> {
    const model = this.createQueryBuilder('model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .leftJoinAndSelect('model.modelProcesses', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .leftJoinAndSelect('expectedResult.maxLevel', 'maxLevel')
      .leftJoinAndSelect('expectedResult.minLevel', 'minLevel')
      .leftJoinAndSelect('model.modelCapacities', 'modelCapacity')
      .leftJoinAndSelect('modelCapacity.minModelLevel', 'minModelLevel')
      .leftJoinAndSelect('modelCapacity.maxModelLevel', 'maxModelLevel')
      .where('model.id = :modelId', { modelId })
      .getOne()

    return model
  }
}
