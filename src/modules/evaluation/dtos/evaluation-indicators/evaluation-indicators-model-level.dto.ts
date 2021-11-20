import { EvaluationIndicatorsModelProcessDto } from '.'

export class EvaluationIndicatorsModelLevelDto {
  id: string
  name: string
  initial: string
  modelProcess: EvaluationIndicatorsModelProcessDto[]
}
