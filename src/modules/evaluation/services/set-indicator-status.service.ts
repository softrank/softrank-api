import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { IndicatorDto } from '../dtos/evaluation-indicators'
import { SetIndicatorStatusDto } from '../dtos/indicator'
import { Indicator } from '../entities'
import { IndicatorStatusEnum } from '../enums'
import { IndicatorNotFoundError } from '../errors'

@Injectable()
export class SetIndicatorStatusService {
  constructor(@InjectRepository(Indicator) private readonly indicatorRepository: Repository<Indicator>) {}

  public async setStatus(setIndicatorStatusDto: SetIndicatorStatusDto): Promise<IndicatorDto> {
    const indicator = await getConnection().transaction((manager) => {
      return this.setStatusWithTransaction(setIndicatorStatusDto, manager)
    })
    const indicatorDto = IndicatorDto.fromEntity(indicator)
    return indicatorDto
  }

  public async setStatusWithTransaction(setIndicatorStatusDto: SetIndicatorStatusDto, manager: EntityManager): Promise<Indicator> {
    const indicator = await this.findIndicatorById(setIndicatorStatusDto.indicatorId)
    const changedIndicator = this.updateIndicatorStatus(indicator, setIndicatorStatusDto.status)
    const updatedIndicator = await manager.save(changedIndicator)

    return updatedIndicator
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError()
    }

    return indicator
  }

  private updateIndicatorStatus(indicator: Indicator, status: IndicatorStatusEnum): Indicator {
    indicator.status = status

    return indicator
  }
}
