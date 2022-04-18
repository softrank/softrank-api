import { ModelLevel } from '@modules/model/entities'

export class ListEvaluationModelLevelResponseDto {
  id: string
  modelId: string
  initial: string
  modelName: string

  static fromEntity(modelLevel: ModelLevel): ListEvaluationModelLevelResponseDto {
    const listEvaluationModelLevelResponseDto = new ListEvaluationModelLevelResponseDto()

    listEvaluationModelLevelResponseDto.id = modelLevel.id
    listEvaluationModelLevelResponseDto.initial = modelLevel.initial
    listEvaluationModelLevelResponseDto.modelId = modelLevel.model.id
    listEvaluationModelLevelResponseDto.modelName = modelLevel.model.name

    return listEvaluationModelLevelResponseDto
  }
}
