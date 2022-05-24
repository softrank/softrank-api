import { EvaluationProject } from '@modules/evaluation/entities'

export class EvaluationProjectDto {
  id: string
  name: string

  static fromEntity(evaluationProject: EvaluationProject): EvaluationProjectDto {
    const evaluationProjectDto = new EvaluationProjectDto()

    evaluationProjectDto.id = evaluationProject.id
    evaluationProjectDto.name = evaluationProject.name

    return evaluationProjectDto
  }
}
