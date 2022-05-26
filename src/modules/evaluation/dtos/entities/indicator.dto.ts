import { Indicator } from '@modules/evaluation/entities'
import { IndicatorStatusEnum } from '@modules/evaluation/enums'
import { EvidenceSourceDto } from './evidence-source.dto'
import { IndicatorFileDto } from './indicator-file.dto'

export class IndicatorDto {
  id: string
  name: string
  qualityAssuranceGroup: string
  status: IndicatorStatusEnum
  files: IndicatorFileDto[]
  evidenceSources: EvidenceSourceDto[]

  static fromEntity(indicator: Indicator): IndicatorDto {
    const { files, evidenceSources } = indicator
    const indicatorDto = new IndicatorDto()

    indicatorDto.id = indicator.id
    indicatorDto.name = indicator.name
    indicatorDto.status = indicator.status
    indicatorDto.qualityAssuranceGroup = indicator.qualityAssuranceGroup

    if (files) {
      indicatorDto.files = IndicatorFileDto.fromManyEntities(files)
    }

    if (evidenceSources) {
      indicatorDto.evidenceSources = EvidenceSourceDto.fromManyEntities(evidenceSources)
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
