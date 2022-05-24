import { IndicatorDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { ExpectedResultIndicator } from '@modules/evaluation/entities'

export class ExpectedResultIndicatorDto {
  id: string
  expectedResultId: string
  name: string
  initial: string
  descriptions: string
  indicators: IndicatorDto[]

  static fromEntity(expectedResultIndicator: ExpectedResultIndicator): ExpectedResultIndicatorDto {
    const { expectedResult, indicators } = expectedResultIndicator
    const expectedResultIndicatorDto = new ExpectedResultIndicatorDto()

    expectedResultIndicatorDto.id = expectedResultIndicator.id

    if (expectedResult) {
      expectedResultIndicatorDto.expectedResultId = expectedResult.id
      expectedResultIndicatorDto.initial = expectedResult.initial
      expectedResultIndicatorDto.name = expectedResult.name
      expectedResultIndicatorDto.descriptions = expectedResult.description
    }

    if (indicators) {
      expectedResultIndicatorDto.indicators = IndicatorDto.fromManyEntities(indicators)
    }

    return expectedResultIndicatorDto
  }
}
