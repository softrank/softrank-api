import { EvaluationProjectDto } from '@modules/evaluation/dtos/entities'
import { IndicatorFile } from '@modules/evaluation/entities'

export class ListEvaluationProcessesIndicatorFile {
  id: string
  name: string
  source: string
  mimetype: string
  project: EvaluationProjectDto

  static fromEntity(indicatorFile: IndicatorFile): ListEvaluationProcessesIndicatorFile {
    const evaluationIndicatorsFileDto = new ListEvaluationProcessesIndicatorFile()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.mimetype = indicatorFile.mimetype
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source

    if (indicatorFile.evaluationProject) {
      evaluationIndicatorsFileDto.project = EvaluationProjectDto.fromEntity(indicatorFile.evaluationProject)
    }

    return evaluationIndicatorsFileDto
  }

  static fromManyEntities(indicatorFiles: Array<IndicatorFile>): Array<ListEvaluationProcessesIndicatorFile> {
    const listEvaluationProcessesIndicatorFiles = indicatorFiles.map(ListEvaluationProcessesIndicatorFile.fromEntity)
    return listEvaluationProcessesIndicatorFiles
  }
}
