import { EvaluationModelProcessResult } from '@modules/evaluation/entities'

export class EvaluationModelProcessResultDto {
  id: string
  result: string
  expectedModelLevelId: string
  modelProcessId: string

  static fromEntity(evaluationModelProcessResult: EvaluationModelProcessResult): EvaluationModelProcessResultDto {
    const { modelProcess, evaluatedModelLevel } = evaluationModelProcessResult
    const evaluationModelProcessResultDto = new EvaluationModelProcessResultDto()

    evaluationModelProcessResultDto.id = evaluationModelProcessResult.id
    evaluationModelProcessResultDto.result = evaluationModelProcessResult.result

    if (modelProcess) {
      evaluationModelProcessResultDto.modelProcessId = modelProcess.id
    }

    if (evaluatedModelLevel) {
      evaluationModelProcessResultDto.expectedModelLevelId = evaluatedModelLevel.id
    }

    return evaluationModelProcessResultDto
  }

  static fromManyEntities(evaluationModelProcessResults: EvaluationModelProcessResult[]): EvaluationModelProcessResultDto[] {
    const evaluationModelProcessResultDtos = evaluationModelProcessResults?.map(EvaluationModelProcessResultDto.fromEntity)
    return evaluationModelProcessResultDtos || []
  }
}
