import { ModelProcess } from '@modules/model/entities'

export class ListEvaluationProcessesResponseDto {
  id: string
  initial: string
  name: string

  static fromEntity(modelProcess: ModelProcess): ListEvaluationProcessesResponseDto {
    const listEvaluationProcessesResponseDto = new ListEvaluationProcessesResponseDto()

    listEvaluationProcessesResponseDto.id = modelProcess.id
    listEvaluationProcessesResponseDto.initial = modelProcess.initial
    listEvaluationProcessesResponseDto.name = modelProcess.name

    return listEvaluationProcessesResponseDto
  }

  static fromManyEntities(modelProcesses: ModelProcess[]): ListEvaluationProcessesResponseDto[] {
    const listEvaluationProcessesResponseDtos = modelProcesses?.map(ListEvaluationProcessesResponseDto.fromEntity) || []
    return listEvaluationProcessesResponseDtos
  }
}
