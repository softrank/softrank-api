import { EvaluationProjectDto } from '@modules/evaluation/dtos/entities'
import { IndicatorFile } from '../../entities'

export class EvaluationIndicatorsFileDto {
  id: string
  name: string
  source: string
  mimetype: string
  projectId: string
  project: EvaluationProjectDto

  static fromEntity(indicatorFile: IndicatorFile): EvaluationIndicatorsFileDto {
    const evaluationIndicatorsFileDto = new EvaluationIndicatorsFileDto()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.mimetype = indicatorFile.mimetype
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source
    evaluationIndicatorsFileDto.projectId = indicatorFile.evaluationProject?.id
    evaluationIndicatorsFileDto.project = EvaluationProjectDto.fromEntity(indicatorFile.evaluationProject)

    return evaluationIndicatorsFileDto
  }
}
