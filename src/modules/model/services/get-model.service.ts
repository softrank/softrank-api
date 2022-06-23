import { ModelNotFoundError } from '@modules/model/errors'
import { ModelDto } from '@modules/shared/dtos/model'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelRepository } from '../repositories/model-repository'

@Injectable()
export class GetModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  public async listModels(): Promise<ModelDto[]> {
    const models = await this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .leftJoinAndSelect('model.modelProcesses', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .leftJoinAndSelect('expectedResult.maxLevel', 'maxLevel')
      .leftJoinAndSelect('expectedResult.minLevel', 'minLevel')
      .leftJoinAndSelect('model.modelCapacities', 'modelCapacity')
      .leftJoinAndSelect('modelCapacity.minModelLevel', 'minModelLevel')
      .leftJoinAndSelect('modelCapacity.maxModelLevel', 'maxModelLevel')
      .getMany()

    const modelsDto = this.mapToDto(models)
    return modelsDto
  }

  public async getById(id: string): Promise<ModelDto> {
    const model = await this.modelRepository.findFullModelById(id)

    if (!model) {
      throw new ModelNotFoundError()
    }

    const modelDto = this.transformToDto(model)
    return modelDto
  }

  private mapToDto(models: Model[]): ModelDto[] {
    const modelsDto = models?.map(ModelDto.fromEntity)
    return modelsDto
  }

  private transformToDto(model: Model): ModelDto {
    const modelDto = ModelDto.fromEntity(model)
    return modelDto
  }
}
