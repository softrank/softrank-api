import { IndicatorFile } from '../../entities'

export class EvaluationIndicatorsFileDto {
  id: string
  name: string
  source: string
  mimetype: string
  projectId: string

  static fromEntity(indicatorFile: IndicatorFile): EvaluationIndicatorsFileDto {
    const evaluationIndicatorsFileDto = new EvaluationIndicatorsFileDto()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.mimetype = indicatorFile.mimetype
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source
    evaluationIndicatorsFileDto.projectId = indicatorFile.evaluationProject?.id

    return evaluationIndicatorsFileDto
  }
}
