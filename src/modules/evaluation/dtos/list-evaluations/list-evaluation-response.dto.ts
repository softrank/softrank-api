import { Evaluation } from '@modules/evaluation/entities'
import { EvaluationStatusEnum } from '@modules/evaluation/enums'
import { ListEvaluationModelLevelResponseDto } from './list-evaluation-model-level-response.dto'
import { ListEvaluationOrganizationalUnitResponseDto } from './list-evaluation-organizational-unit-response.dto'

export class ListEvaluationResponseDto {
  id: string
  name: string
  modelLevel: ListEvaluationModelLevelResponseDto
  status: EvaluationStatusEnum
  organizationalUnit: ListEvaluationOrganizationalUnitResponseDto

  static fromEntity(evaluation: Evaluation): ListEvaluationResponseDto {
    const listEvaluationResponseDto = new ListEvaluationResponseDto()

    listEvaluationResponseDto.id = evaluation.id
    listEvaluationResponseDto.status = evaluation.status
    listEvaluationResponseDto.name = evaluation.name
    listEvaluationResponseDto.modelLevel = ListEvaluationModelLevelResponseDto.fromEntity(
      evaluation.expectedModelLevel
    )
    listEvaluationResponseDto.organizationalUnit = ListEvaluationOrganizationalUnitResponseDto.fromEntity(
      evaluation.organizationalUnit
    )

    return listEvaluationResponseDto
  }
}
