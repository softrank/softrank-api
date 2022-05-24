import { EvaluationProjectDto } from '@modules/evaluation/dtos/entities'
import { IndicatorFile } from '@modules/evaluation/entities'

export class IndicatorFileDto {
  id: string
  name: string
  source: string
  project: EvaluationProjectDto

  static fromEntity(indicatorFile: IndicatorFile): IndicatorFileDto {
    const { evaluationProject } = indicatorFile
    const indicatorFileDto = new IndicatorFileDto()

    indicatorFileDto.id = indicatorFile.id
    indicatorFileDto.name = indicatorFile.name
    indicatorFileDto.source = indicatorFile.source

    if (evaluationProject) {
      indicatorFileDto.project = EvaluationProjectDto.fromEntity(indicatorFile.evaluationProject)
    }

    return indicatorFileDto
  }

  static fromManyEntities(indicatorFiles: IndicatorFile[]): IndicatorFileDto[] {
    const indicatorsFileDtos = indicatorFiles?.map(IndicatorFileDto.fromEntity)
    return indicatorsFileDtos || []
  }
}
