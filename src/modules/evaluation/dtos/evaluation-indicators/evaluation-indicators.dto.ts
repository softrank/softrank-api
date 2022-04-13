import { EvaluationStatusEnum } from '@modules/evaluation/enums'
import { EvaluationIndicatorsModelLevelDto } from '.'

export class EvaluationIndicatorsDto {
  id: string
  evaluationId: string
  status: EvaluationStatusEnum
  modelLevels: EvaluationIndicatorsModelLevelDto[]
}
