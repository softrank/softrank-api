import { EntityRepository, Repository } from 'typeorm'
import { Indicator } from '../entities'

@EntityRepository(Indicator)
export class IndicatorRepository extends Repository<Indicator> {
  public async softDeleteIndicatorById(indicatorId: string): Promise<void> {
    await this.query(
      `
      update evaluation.indicator
      set
        "deletedAt" = now()
      where
        id = $1::uuid
    `,
      [indicatorId]
    )

    await this.softDeleteIndicatorFilesByIndicatorId(indicatorId)
  }

  public async softDeleteIndicatorFilesByIndicatorId(indicatorId: string): Promise<void> {
    await this.query(
      `
      update evaluation.indicator_file
      set
        "deletedAt" = now()
      where
        "indicatorId" = $1::uuid
    `,
      [indicatorId]
    )
  }
}
