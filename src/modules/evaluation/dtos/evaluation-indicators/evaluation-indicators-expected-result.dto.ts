import { EvaluationIndicatorsIndicatorDto } from '.'

export class EvaluationIndicatorsExpectedResultDto {
  id: string
  expectedResultId: string
  name: string
  initial: string
  description: string
  indicators: EvaluationIndicatorsIndicatorDto[]
}
