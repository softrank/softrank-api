import { ModelProcessTypeEnum } from '@modules/model/enum'
import { EvaluationIndicatorsExpectedResultDto } from '.'

export class EvaluationIndicatorsModelProcessDto {
  id: string
  name: string
  initial: string
  description: string
  expectedResults: EvaluationIndicatorsExpectedResultDto[]
  type: ModelProcessTypeEnum
}
