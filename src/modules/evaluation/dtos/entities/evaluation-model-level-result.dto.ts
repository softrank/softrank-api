import { EvaluationModelLevelResult } from '@modules/evaluation/entities'

export class EvaluationModelLevelResultDto {
  id: string
  modelLevelId: string
  result: string

  static fromEntity(evaluationModelLevelResult: EvaluationModelLevelResult): EvaluationModelLevelResultDto {
    const { modelLevel } = evaluationModelLevelResult
    const evaluationModelLevelResultDto = new EvaluationModelLevelResultDto()

    evaluationModelLevelResultDto.id = evaluationModelLevelResult.id
    evaluationModelLevelResultDto.result = evaluationModelLevelResult.result

    if (modelLevel) {
      evaluationModelLevelResultDto.modelLevelId = modelLevel.id
    }

    return evaluationModelLevelResultDto
  }

  static fromManyEntities(evaluationModelLevelResults: EvaluationModelLevelResult[]): EvaluationModelLevelResultDto[] {
    const evaluationModelLevelResultDtos = evaluationModelLevelResults?.map(EvaluationModelLevelResultDto.fromEntity)
    return evaluationModelLevelResultDtos || []
  }
}
