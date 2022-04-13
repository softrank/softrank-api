import { EvaluationIndicatorsProjectDto, EvaluationIndicatorsFileDto } from '.'

export class EvaluationIndicatorsIndicatorDto {
  id: string
  content: string
  files: EvaluationIndicatorsFileDto[]
  projects: EvaluationIndicatorsProjectDto[]
}
