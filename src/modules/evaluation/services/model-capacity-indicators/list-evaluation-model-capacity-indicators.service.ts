import { ModelCapacityIndicatorDto } from '@modules/evaluation/dtos/entities'
import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class ListEvaluationModelCapacityIndicatorsService {
  constructor(
    @InjectRepository(ModelCapacityIndicator) private readonly modelCapacityIndicatorRepository: Repository<ModelCapacityIndicator>
  ) {}

  public async list(evaluationId: string, type: ModelCapacityTypeEnum): Promise<ModelCapacityIndicatorDto[]> {
    const modelCapacitiesIndicators = await this.listModelCapacitiesIndicatorByEvaluationId(evaluationId, type)
    const modelCapacitiesIndicatorsDtos = ModelCapacityIndicatorDto.fromManyEntities(modelCapacitiesIndicators)

    return modelCapacitiesIndicatorsDtos
  }

  private listModelCapacitiesIndicatorByEvaluationId(evaluationId: string, type: ModelCapacityTypeEnum): Promise<ModelCapacityIndicator[]> {
    const modelCapacityQueryBuilder = this.modelCapacityIndicatorRepository
      .createQueryBuilder('modelCapacityIndicator')
      .innerJoinAndSelect('modelCapacityIndicator.modelCapacity', 'modelCapacity')
      .leftJoinAndSelect('modelCapacityIndicator.indicators', 'indicator')
      .leftJoinAndSelect('modelCapacityIndicator.targetAvaliations', 'targetAvaliation')
      .leftJoinAndSelect('indicator.evidenceSources', 'evidenceSource')
      .leftJoinAndSelect('evidenceSource.files', 'evidenceSourceFile')
      .leftJoinAndSelect('evidenceSource.evaluationProject', 'evaluationProject')
      .leftJoinAndSelect('evidenceSource.modelProcess', 'modelProcess')
      .where('modelCapacityIndicator.evaluation = :evaluationId')

    if (type) {
      modelCapacityQueryBuilder.andWhere('modelCapacity.type = :type')
    }

    modelCapacityQueryBuilder.setParameters({ evaluationId, type })

    return modelCapacityQueryBuilder.getMany()
  }
}
