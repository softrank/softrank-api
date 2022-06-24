import { ModelCapacityIndicatorDto } from '@modules/evaluation/dtos/entities'
import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { ModelCapacityIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ModelCapacityIndicatorNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class SetModelCapacityIndicatorStatusService {
  constructor(
    @InjectRepository(ModelCapacityIndicator)
    private readonly modelCapacityIndicatorRepository: Repository<ModelCapacityIndicator>
  ) {}

  public async setStatus(modelCapacityIndicatorId: string, status: ModelCapacityIndicatorStatusEnum): Promise<ModelCapacityIndicatorDto> {
    const modelCapacityIndicator = await getConnection().transaction((manager) => {
      return this.setStatusWithTransaction(modelCapacityIndicatorId, status, manager)
    })

    const modelCapacityIndicatorDto = ModelCapacityIndicatorDto.fromEntity(modelCapacityIndicator)
    return modelCapacityIndicatorDto
  }

  public async setStatusWithTransaction(
    modelCapacityIndicatorId: string,
    status: ModelCapacityIndicatorStatusEnum,
    manager: EntityManager
  ): Promise<ModelCapacityIndicator> {
    const modelCapacityIndicator = await this.findModelCapacityIndicatorById(modelCapacityIndicatorId)
    this.setModelCapacityStatus(modelCapacityIndicator, status)
    const updatedModelCapacityStatus = await manager.save(modelCapacityIndicator)

    return updatedModelCapacityStatus
  }

  private async findModelCapacityIndicatorById(modelCapacityIndicatorId: string): Promise<ModelCapacityIndicator> {
    const modelCapacityIndicator = await this.modelCapacityIndicatorRepository
      .createQueryBuilder('modelCapacityIndicator')
      .where('modelCapacityIndicator.id = :modelCapacityIndicatorId')
      .setParameters({ modelCapacityIndicatorId })
      .getOne()

    if (!modelCapacityIndicator) {
      throw new ModelCapacityIndicatorNotFoundError()
    }

    return modelCapacityIndicator
  }

  private setModelCapacityStatus(modelCapacityIndicator: ModelCapacityIndicator, status: ModelCapacityIndicatorStatusEnum): void {
    modelCapacityIndicator.status = status
  }
}
