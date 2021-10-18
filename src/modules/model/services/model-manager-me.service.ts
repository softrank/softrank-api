import { ModelManager } from '../entities'
import { ModelManagerDto } from '../../shared/dtos/model/model-manager.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ModelManagerNotFoundError } from '../errors/model-manager-errors'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ModelManagerMeService {
  constructor(
    @InjectRepository(ModelManager) private readonly modelManagerRepository: Repository<ModelManager>
  ) {}

  public async me(modelManagerId: string): Promise<ModelManagerDto> {
    const modelManager = await this.findModelManagerById(modelManagerId)

    return ModelManagerDto.fromEntity(modelManager)
  }

  private async findModelManagerById(modelManagerId: string): Promise<ModelManager> {
    const modelManager = await this.modelManagerRepository
      .createQueryBuilder('modelManager')
      .leftJoinAndSelect('modelManager.commonEntity', 'modelManager')
      .leftJoinAndSelect('modelManager.models', 'models')
      .where('modelManager.id = :modelManagerId', { modelManagerId })
      .getOne()

    if (!modelManager) {
      throw new ModelManagerNotFoundError()
    }

    return modelManager
  }
}
