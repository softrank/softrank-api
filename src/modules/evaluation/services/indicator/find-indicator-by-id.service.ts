import { IndicatorDto } from '@modules/evaluation/dtos/entities'
import { Indicator } from '@modules/evaluation/entities'
import { IndicatorNotFoundError } from '@modules/evaluation/errors'
import { IndicatorRepository } from '@modules/evaluation/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindIndicatorByIdService {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  public async find(indicatorId: string): Promise<IndicatorDto> {
    const indicator = await this.findIndicatorById(indicatorId)
    const indicatorDto = IndicatorDto.fromEntity(indicator)
    return indicatorDto
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = this.indicatorRepository
      .createQueryBuilder('indicator')
      .innerJoinAndSelect('indicator.expectedResultIndicator', 'expectedResultIndicator')
      .innerJoinAndSelect('expectedResultIndicator.expectedResult', 'expectedResult')
      .leftJoinAndSelect('indicator.evidenceSources', 'evidenceSource')
      .leftJoinAndSelect('evidenceSource.files', 'files')
      .leftJoinAndSelect('evidenceSource.evaluationProject', 'evaluationProject')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError('Indicador não encontrado.')
    }

    return indicator
  }
}
