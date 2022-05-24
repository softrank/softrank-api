import { IndicatorRepository } from '@modules/evaluation/repositories'
import { IndicatorNotFoundError } from '@modules/evaluation/errors'
import { Indicator } from '@modules/evaluation/entities'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteIndicatorService {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  public async delete(indicatorId: string): Promise<void> {
    await getConnection().transaction(async (manager) => {
      await this.deleteWithTransaction(indicatorId, manager)
    })
  }

  public async deleteWithTransaction(indicatorId: string, manager: EntityManager): Promise<void> {
    const indicator = await this.findIndicatorById(indicatorId)
    await this.deleteIndicator(indicator, manager)
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
      .leftJoinAndSelect('indicator.files', 'indicatorFile')
      .leftJoinAndSelect('indicatorFile.evaluationProject', 'evaluationProject')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError()
    }

    return indicator
  }

  private async deleteIndicator(indicator: Indicator, manager: EntityManager): Promise<void> {
    const hasFiles = Boolean(indicator.files?.length)

    if (!hasFiles) {
      await this.hardDeleteIndicator(indicator, manager)
    } else {
      await this.softDeleteIndicator(indicator, manager)
    }
  }

  private async hardDeleteIndicator(indicator: Indicator, manager: EntityManager): Promise<void> {
    await manager.remove(indicator)
  }

  private async softDeleteIndicator(indicator: Indicator, manager: EntityManager): Promise<void> {
    await manager.getCustomRepository(IndicatorRepository).softDeleteIndicatorById(indicator.id)
  }
}
