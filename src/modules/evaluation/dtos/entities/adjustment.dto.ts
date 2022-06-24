import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { Adjustment } from '@modules/evaluation/entities'
import { AjustmentTypeEnum } from '@modules/evaluation/enums'

export class AdjustmentDto {
  id: string
  suggestion: string
  type: AjustmentTypeEnum
  problem: string
  resolution: string
  expectedResult: ExpectedResultDto

  static fromEntity(ajustment: Adjustment): AdjustmentDto {
    const { expectedResult } = ajustment
    const ajustmentDto = new AdjustmentDto()

    ajustmentDto.id = ajustment.id
    ajustmentDto.type = ajustment.type
    ajustmentDto.problem = ajustment.problem
    ajustmentDto.suggestion = ajustment.suggestion
    ajustmentDto.resolution = ajustment.resolution

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
