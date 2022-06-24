import { UpdateAdjustmentDto } from '@modules/evaluation/dtos/ajustment'
import { AdjustmentNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { AdjustmentDto } from '@modules/evaluation/dtos/entities'
import { Adjustment } from '@modules/evaluation/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateAdjustmentService {
  constructor(@InjectRepository(Adjustment) private readonly adjustmentRepository: Repository<Adjustment>) {}

  public async update(updateAdjustmentDto: UpdateAdjustmentDto): Promise<AdjustmentDto> {
    const adjustment = await getConnection().transaction((manager) => {
      return this.updateWithTransaction(updateAdjustmentDto, manager)
    })

    const adjustmentDto = AdjustmentDto.fromEntity(adjustment)
    return adjustmentDto
  }

  public async updateWithTransaction(updateAdjustmentDto: UpdateAdjustmentDto, manager: EntityManager): Promise<Adjustment> {
    const adjustment = await this.findAdjustmentById(updateAdjustmentDto.adjustmentId)
    const adjustmentToUpdate = this.updateAdjustmentData(adjustment, updateAdjustmentDto)
    const updatedAdjustment = await manager.save(adjustmentToUpdate)

    return updatedAdjustment
  }

  private async findAdjustmentById(adjustmentId: string): Promise<Adjustment> {
    const adjustment = await this.adjustmentRepository
      .createQueryBuilder('adjustment')
      .where('adjustment.id = :adjustmentId')
      .setParameters({ adjustmentId })
      .getOne()

    if (!adjustment) {
      throw new AdjustmentNotFoundError()
    }

    return adjustment
  }

  private updateAdjustmentData(adjustment: Adjustment, updateAdjustmentDto: UpdateAdjustmentDto): Adjustment {
    adjustment.problem = updateAdjustmentDto.problem
    adjustment.suggestion = updateAdjustmentDto.suggestion
    adjustment.type = updateAdjustmentDto.type
    adjustment.resolution = updateAdjustmentDto.resolution

    return adjustment
  }
}
