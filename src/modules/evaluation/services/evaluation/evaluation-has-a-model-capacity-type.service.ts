import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class EvaluationHasAModelCapacityTypeService {
  constructor(
    @InjectRepository(ModelCapacityIndicator) private readonly modelCapacityIndicatorRepository: Repository<ModelCapacityIndicator>
  ) {}

  public async verify(evaluationId: string, type: ModelCapacityTypeEnum): Promise<boolean> {
    const hasAModelCapacityType = await this.findOrganizationalModelCapacityIndicator(evaluationId, type)
    return hasAModelCapacityType
  }

  private async findOrganizationalModelCapacityIndicator(evaluationId: string, type: ModelCapacityTypeEnum): Promise<boolean> {
    const modelCapacityIndicator = await this.modelCapacityIndicatorRepository
      .createQueryBuilder('modelCapacityIndicator')
      .innerJoin('modelCapacityIndicator.modelCapacity', 'modelCapacity')
      .where('modelCapacityIndicator.evaluation = :evaluationId')
      .andWhere('modelCapacity.type = :type')
      .setParameters({ evaluationId, type })
      .getOne()

    return Boolean(modelCapacityIndicator)
  }
}
