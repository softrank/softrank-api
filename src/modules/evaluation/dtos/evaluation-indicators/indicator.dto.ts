import { Indicator } from '@modules/evaluation/entities'
import { IndicatorStatusEnum } from '@modules/evaluation/enums'

export class IndicatorDto {
  id: string
  name: string
  qualityAssuranceGroup: string
  status: IndicatorStatusEnum

  static fromEntity(indicator: Indicator): IndicatorDto {
    const indicatorDto = new IndicatorDto()

    indicatorDto.id = indicator.id
    indicatorDto.name = indicator.name
    indicatorDto.status = indicator.status
    indicatorDto.qualityAssuranceGroup = indicator.qualityAssuranceGroup

    return indicatorDto
  }

  static fromManyEntities(indicators: Indicator[]): IndicatorDto[] {
    const indicatorsDto = indicators?.map((indicator) => {
      return IndicatorDto.fromEntity(indicator)
    })

    return indicatorsDto || []
  }
}
