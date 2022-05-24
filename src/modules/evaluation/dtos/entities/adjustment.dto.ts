import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { Adjustment } from '@modules/evaluation/entities'

export class AdjustmentDto {
  id: string
  suggestion: string
  problem: string
  expectedResult: ExpectedResultDto

  static fromEntity(ajustment: Adjustment): AdjustmentDto {
    const { expectedResult } = ajustment
    const ajustmentDto = new AdjustmentDto()

    ajustmentDto.id = ajustment.id
    ajustmentDto.problem = ajustment.problem
    ajustmentDto.suggestion = ajustment.suggestion

    if (expectedResult) {
      ajustmentDto.expectedResult = ExpectedResultDto.fromEntity(expectedResult)
    }

    return ajustmentDto
  }

  static fromManyEntities(ajustments: Adjustment[]): AdjustmentDto[] {
    const adjustmentsDtos = ajustments?.map(AdjustmentDto.fromEntity)
    return adjustmentsDtos || []
  }
}
