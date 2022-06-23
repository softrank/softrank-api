import { EvidenceSourceStatusEnum, TranslatedEvaluationStateEnum, evaluationStateMapper } from '@modules/evaluation/enums'
import { EvidenceSourceFileDto } from './evidence-source-file.dto'
import { EvaluationProjectDto } from './evaluation-project.dto'
import { EvidenceSource } from '@modules/evaluation/entities'
import { IndicatorDto } from './indicator.dto'
import { ModelProcessDto } from '@modules/shared/dtos/model'

export class EvidenceSourceDto {
  id: string
  indicator: IndicatorDto
  project: EvaluationProjectDto
  files: EvidenceSourceFileDto[]
  status: EvidenceSourceStatusEnum
  createdOn: TranslatedEvaluationStateEnum
  modelProcess: ModelProcessDto

  static fromEntity(evidenceSource: EvidenceSource): EvidenceSourceDto {
    const { evaluationProject, files, indicator, modelProcess } = evidenceSource
    const evidenceSourceDto = new EvidenceSourceDto()

    evidenceSourceDto.id = evidenceSource.id
    evidenceSourceDto.status = evidenceSource.status
    evidenceSourceDto.createdOn = evaluationStateMapper[evidenceSource.createdOn]

    if (files) {
      evidenceSourceDto.files = EvidenceSourceFileDto.fromManyEntities(files)
    }

    if (evaluationProject) {
      evidenceSourceDto.project = EvaluationProjectDto.fromEntity(evaluationProject)
    }

    if (indicator) {
      evidenceSourceDto.indicator = IndicatorDto.fromEntity(indicator)
    }

    if (modelProcess) {
      evidenceSourceDto.modelProcess = ModelProcessDto.fromEntity(modelProcess)
    }

    return evidenceSourceDto
  }

  static fromManyEntities(evidenceSources: EvidenceSource[]): EvidenceSourceDto[] {
    const evidenceSourcesDtos = evidenceSources?.map(EvidenceSourceDto.fromEntity)
    return evidenceSourcesDtos || []
  }
}
