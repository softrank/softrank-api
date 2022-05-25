import { EvaluationPlan, Interview } from '@modules/evaluation/entities'

export class EvaluationPlanDto {
  id: string
  name: string
  source: string

  static fromEntity(evaluationPlan: EvaluationPlan): EvaluationPlanDto {
    const evaluationPlanDto = new EvaluationPlanDto()

    evaluationPlanDto.id = evaluationPlan.id
    evaluationPlanDto.name = evaluationPlan.name
    evaluationPlanDto.source = evaluationPlan.source

    return evaluationPlanDto
  }

  static fromManyEntities(evaluationPlans: EvaluationPlan[]): EvaluationPlanDto[] {
    const evaluationPlansDtos = evaluationPlans?.map(EvaluationPlanDto.fromEntity)
    return evaluationPlansDtos || []
  }
}
