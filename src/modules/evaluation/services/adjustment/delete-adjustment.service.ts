import { Adjustment } from '@modules/evaluation/entities'
import { AdjustmentNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class DeleteAdjustmentService {
  constructor(@InjectRepository(Adjustment) private readonly adjustmentRepository: Repository<Adjustment>) {}

  public async delete(adjustmentId: string): Promise<void> {
    await getConnection().transaction((manager) => {
      return this.deleteWithTransaction(adjustmentId, manager)
    })
  }

  public async deleteWithTransaction(adjustmentId: string, manager: EntityManager): Promise<void> {
    await this.verifyIfAdjustmentExists(adjustmentId)
    await this.softDeleteAdjustment(adjustmentId, manager)
  }

  private async verifyIfAdjustmentExists(adjustmentId: string): Promise<void> {
    const adjustment = await this.adjustmentRepository
      .createQueryBuilder('adjustment')
      .where('adjustment.id = :adjustmentId')
      .setParameters({ adjustmentId })
      .getOne()

    if (!adjustment) {
      throw new AdjustmentNotFoundError()
    }
  }

  private async softDeleteAdjustment(adjustmentId: string, manager: EntityManager): Promise<void> {
    await manager.query(
      `
      update
        evaluation.adjustment
      set
        "deletedAt" = now()
      where
        id = $1::uuid
    `,
      [adjustmentId]
    )
  }
}
