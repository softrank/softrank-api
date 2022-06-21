import { AdjustmentDto } from '@modules/evaluation/dtos/entities'
import { Adjustment } from '@modules/evaluation/entities'
import { AdjustmentNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindAdjustmentByIdService {
  constructor(@InjectRepository(Adjustment) private readonly adjustmentRepository: Repository<Adjustment>) {}

  public async find(adjustmentId: string): Promise<AdjustmentDto> {
    const adjustment = await this.findAdjustmentById(adjustmentId)
    const adjustmentDto = AdjustmentDto.fromEntity(adjustment)
    return adjustmentDto
  }

  private async findAdjustmentById(adjustmentId: string): Promise<Adjustment> {
    const adjustment = await this.adjustmentRepository
      .createQueryBuilder('adjustment')
      .innerJoinAndSelect('adjustment.expectedResult', 'expectedResult')
      .where('adjustment.id = :adjustmentId')
      .setParameters({ adjustmentId })
      .getOne()

    if (!adjustment) {
      throw new AdjustmentNotFoundError()
    }

    return adjustment
  }
}
