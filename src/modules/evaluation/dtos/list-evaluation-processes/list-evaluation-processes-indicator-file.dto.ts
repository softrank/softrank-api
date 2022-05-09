import { IndicatorFile } from '../../entities'

export class ListEvaluationProcessesIndicatorFile {
  id: string
  name: string
  source: string
  mimetype: string

  static fromEntity(indicatorFile: IndicatorFile): ListEvaluationProcessesIndicatorFile {
    const evaluationIndicatorsFileDto = new ListEvaluationProcessesIndicatorFile()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.mimetype = indicatorFile.mimetype
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source

    return evaluationIndicatorsFileDto
  }

  static fromManyEntities(indicatorFiles: Array<IndicatorFile>): Array<ListEvaluationProcessesIndicatorFile> {
    const listEvaluationProcessesIndicatorFiles = indicatorFiles.map(ListEvaluationProcessesIndicatorFile.fromEntity)
    return listEvaluationProcessesIndicatorFiles
  }
}
