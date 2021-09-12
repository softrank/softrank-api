import { ModelNotFoundError } from '@modules/model/errors'
import { ModelDto } from '@modules/shared/dtos/model'
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

  public async listModels(): Promise<ModelDto[]> {
    const models = await this.modelRepository.find({
      relations: ['modelProcesses', 'modelLevels', 'modelProcesses.expectedResults']
    })

    const modelsDto = this.mapToDto(models)
    return modelsDto
  }

  public async getById(id: string): Promise<ModelDto> {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: ['modelProcesses', 'modelLevels', 'modelProcesses.expectedResults']
    })

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
