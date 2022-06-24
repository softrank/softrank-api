import { ExpectedResultIndicator } from '@modules/evaluation/entities'
import { IndicatorDto, TargetAvaliationDto } from '@modules/evaluation/dtos/entities'
import { ExpectedResultIndicatorStatusEnum } from '@modules/evaluation/enums'

export class ExpectedResultIndicatorDto {
  id: string
  expectedResultId: string
  status: ExpectedResultIndicatorStatusEnum
  name: string
  initial: string
  description: string
  indicators: IndicatorDto[]
  projectsAvaliations: TargetAvaliationDto[]

  static fromEntity(expectedResultIndicator: ExpectedResultIndicator): ExpectedResultIndicatorDto {
    const { expectedResult, indicators, targetAvaliations } = expectedResultIndicator
    const expectedResultIndicatorDto = new ExpectedResultIndicatorDto()

    expectedResultIndicatorDto.id = expectedResultIndicator.id
    expectedResultIndicatorDto.status = expectedResultIndicator.status

    if (expectedResult) {
      expectedResultIndicatorDto.expectedResultId = expectedResult.id
      expectedResultIndicatorDto.initial = expectedResult.initial
      expectedResultIndicatorDto.name = expectedResult.name
      expectedResultIndicatorDto.description = expectedResult.description
    }

    if (indicators) {
      expectedResultIndicatorDto.indicators = IndicatorDto.fromManyEntities(indicators)
    }

    if (targetAvaliations) {
      expectedResultIndicatorDto.projectsAvaliations = TargetAvaliationDto.fromManyEntities(targetAvaliations)
    }

    return expectedResultIndicatorDto
  }
}
