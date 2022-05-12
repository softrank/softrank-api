import { ModelProcess } from '@modules/model/entities'
import { ListEvaluationProcessesExpectedResultIndicator } from './list-evaluation-processes-expected-result-indicator.dto'

export class ListEvaluationProcessesResponseDto {
  id: string
  initial: string
  name: string
  expectedResults: Array<ListEvaluationProcessesExpectedResultIndicator>

  static fromEntity(modelProcess: ModelProcess): ListEvaluationProcessesResponseDto {
    const listEvaluationProcessesResponseDto = new ListEvaluationProcessesResponseDto()

    listEvaluationProcessesResponseDto.id = modelProcess.id
    listEvaluationProcessesResponseDto.initial = modelProcess.initial
    listEvaluationProcessesResponseDto.name = modelProcess.name
    listEvaluationProcessesResponseDto.expectedResults = ListEvaluationProcessesExpectedResultIndicator.fromManyEntities(
      modelProcess.expectedResults
    )

    return listEvaluationProcessesResponseDto
  }

  static fromManyEntities(modelProcesses: Array<ModelProcess>): Array<ListEvaluationProcessesResponseDto> {
    const listEvaluationProcessesResponseDtos = modelProcesses.map(ListEvaluationProcessesResponseDto.fromEntity)
    return listEvaluationProcessesResponseDtos
  }
}
