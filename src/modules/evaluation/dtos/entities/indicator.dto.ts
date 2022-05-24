import { Indicator } from '@modules/evaluation/entities'
import { IndicatorStatusEnum } from '@modules/evaluation/enums'
import { IndicatorFileDto } from './indicator-file.dto'

export class IndicatorDto {
  id: string
  name: string
  qualityAssuranceGroup: string
  status: IndicatorStatusEnum
  files: IndicatorFileDto[]

  static fromEntity(indicator: Indicator): IndicatorDto {
    const { files } = indicator
    const indicatorDto = new IndicatorDto()

    indicatorDto.id = indicator.id
    indicatorDto.name = indicator.name
    indicatorDto.status = indicator.status
    indicatorDto.qualityAssuranceGroup = indicator.qualityAssuranceGroup

    if (files) {
      indicatorDto.files = IndicatorFileDto.fromManyEntities(files)
    }

    return indicatorDto
  }

  static fromManyEntities(indicators: Indicator[]): IndicatorDto[] {
    const indicatorsDto = indicators?.map((indicator) => {
      return IndicatorDto.fromEntity(indicator)
    })

    return indicatorsDto || []
  }
}
