import { ExpectedResultIndicator } from '@modules/evaluation/entities'
import { IndicatorDto } from '@modules/evaluation/dtos/entities'
import { ExpectedResultIndicatorStatusEnum } from '@modules/evaluation/enums'

export class ExpectedResultIndicatorDto {
  id: string
  expectedResultId: string
  status: ExpectedResultIndicatorStatusEnum
  name: string
  initial: string
  descriptions: string
  indicators: IndicatorDto[]

  static fromEntity(expectedResultIndicator: ExpectedResultIndicator): ExpectedResultIndicatorDto {
    const { expectedResult, indicators } = expectedResultIndicator
    const expectedResultIndicatorDto = new ExpectedResultIndicatorDto()

    expectedResultIndicatorDto.id = expectedResultIndicator.id
    expectedResultIndicatorDto.status = expectedResultIndicator.status

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
