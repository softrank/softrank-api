import { AdjustmentDto } from '@modules/evaluation/dtos/entities'
import { Adjustment } from '@modules/evaluation/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class ListEvaluationAdjustments {
  constructor(@InjectRepository(Adjustment) private readonly adjustmentRepository: Repository<Adjustment>) {}

  public async list(evaluationId: string): Promise<AdjustmentDto[]> {
    const adjustments = await this.listAdjustments(evaluationId)
    const adjustmentsDtos = AdjustmentDto.fromManyEntities(adjustments)
    return adjustmentsDtos
  }

  public async listAdjustments(evaluationId: string): Promise<Adjustment[]> {
    const adjustments = await this.adjustmentRepository
      .createQueryBuilder('adjustment')
      .innerJoinAndSelect('adjustment.expectedResult', 'expectedResult')
      .innerJoinAndSelect('expectedResult.modelProcess', 'modelProcess')
      .innerJoinAndSelect('modelProcess.model', 'model')
      .where('adjustment."evaluationId" = :evaluationId')
      .setParameters({ evaluationId })
      .getMany()

    return adjustments
  }
}
