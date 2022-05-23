import { Indicator } from '@modules/evaluation/entities'

export class IndicatorDto {
  id: string
  name: string

  static fromEntity(indicator: Indicator): IndicatorDto {
    const indicatorDto = new IndicatorDto()

    indicatorDto.id = indicator.id
    indicatorDto.name = indicator.name

    return indicatorDto
  }

  static fromManyEntities(indicators: Indicator[]): IndicatorDto[] {
    const indicatorsDto = indicators?.map((indicator) => {
      return IndicatorDto.fromEntity(indicator)
    })

    return indicatorsDto || []
  }
}
