import { ExpectedResultIndicatorDto } from '../evaluation-indicators'
import { Adjustment } from '@modules/evaluation/entities'

export class AdjustmentDto {
  id: string
  suggestion: string
  problem: string
  expectedResultIndicator: ExpectedResultIndicatorDto

  static fromEntity(ajustment: Adjustment): AdjustmentDto {
    const { expectedResultIndicator } = ajustment
    const ajustmentDto = new AdjustmentDto()

    ajustmentDto.id = ajustment.id
    ajustmentDto.problem = ajustment.problem
    ajustmentDto.suggestion = ajustment.suggestion

    if (expectedResultIndicator) {
      ajustmentDto.expectedResultIndicator = ExpectedResultIndicatorDto.fromEntity(expectedResultIndicator)
    }

    return ajustmentDto
  }
}
