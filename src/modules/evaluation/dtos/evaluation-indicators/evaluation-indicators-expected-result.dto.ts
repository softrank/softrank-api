import { EvaluationIndicatorsIndicatorDto } from '.'

export class EvaluationIndicatorsExpectedResultDto {
  id: string
  name: string
  initial: string
  description: string
  indicators: EvaluationIndicatorsIndicatorDto[]
}
