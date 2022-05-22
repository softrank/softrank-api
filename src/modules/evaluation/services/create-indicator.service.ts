import { Injectable } from '@nestjs/common'
import { Indicator } from '../entities/indicator.entity'
import { getConnection, Repository, EntityManager } from 'typeorm'
import { ExpectedResultIndicator } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluationIndicatorsIndicatorDto } from '../dtos/evaluation-indicators'
import { ExpectedResultIndicatorNotFoundError } from '../errors'

@Injectable()
export class CreateIndicatorService {
  constructor(
    @InjectRepository(ExpectedResultIndicator)
    private readonly expectedResultIndicatorRepository: Repository<ExpectedResultIndicator>
  ) {}
  public async create(expectedResultIndicatorId: string): Promise<EvaluationIndicatorsIndicatorDto> {
    const indicator = await getConnection().transaction((manager) => {
      return this.createWithTransaction(expectedResultIndicatorId, manager)
    })

    return this.buildEvaluationIndicatorsIndicatorDto(indicator)
  }

  public async createWithTransaction(expectedResultIndicatorId: string, manager: EntityManager): Promise<Indicator> {
    const expectedResultIndicator = await this.findExpectedResultIndicatorById(expectedResultIndicatorId)
    const indicatorToCreate = this.buildIndicator(expectedResultIndicator)
    const indicator = await manager.save(indicatorToCreate)

    return indicator
  }

  private async findExpectedResultIndicatorById(expectedResultIndicatorId: string): Promise<ExpectedResultIndicator> {
    const expectedResultIndicator = await this.expectedResultIndicatorRepository
      .createQueryBuilder('expectedResultIndicator')
      .where('expectedResultIndicator.id = :expectedResultIndicatorId')
      .setParameters({ expectedResultIndicatorId })
      .getOne()

    if (!expectedResultIndicator) {
      throw new ExpectedResultIndicatorNotFoundError()
    }

    return expectedResultIndicator
  }

  private buildIndicator(expectedResultIndicator: ExpectedResultIndicator): Indicator {
    const indicator = new Indicator()

    indicator.expectedResultIndicator = expectedResultIndicator

    return indicator
  }

  private buildEvaluationIndicatorsIndicatorDto(indicator: Indicator): EvaluationIndicatorsIndicatorDto {
    const evaluationIndicatorsIndicatorDto = new EvaluationIndicatorsIndicatorDto()

    evaluationIndicatorsIndicatorDto.id = indicator.id
    evaluationIndicatorsIndicatorDto.content = indicator.content
    evaluationIndicatorsIndicatorDto.files = []

    return evaluationIndicatorsIndicatorDto
  }
}
