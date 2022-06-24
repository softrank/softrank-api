import { ExpectedResultIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ExpectedResult } from '@modules/model/entities'
import { IndicatorDto, TargetAvaliationDto } from '../entities'

export class ListEvaluationProcessesExpectedResultIndicator {
  id: string
  expectedResultId: string
  status: ExpectedResultIndicatorStatusEnum
  name: string
  initial: string
  description: string
  indicators: IndicatorDto[]
  projectsAvaliations: TargetAvaliationDto[]

  static fromEntity(expectedResult: ExpectedResult): ListEvaluationProcessesExpectedResultIndicator {
    const {
      expectedResultIndicators: [expectedResultIndicator]
    } = expectedResult
    expectedResultIndicator.expectedResult = expectedResult

    const { indicators } = expectedResultIndicator

    const listEvaluationProcessesExpectedResultIndicator = new ListEvaluationProcessesExpectedResultIndicator()

    listEvaluationProcessesExpectedResultIndicator.id = expectedResultIndicator.id
    listEvaluationProcessesExpectedResultIndicator.expectedResultId = expectedResultIndicator.expectedResult.id
    listEvaluationProcessesExpectedResultIndicator.name = expectedResultIndicator.expectedResult.name
    listEvaluationProcessesExpectedResultIndicator.status = expectedResultIndicator.status
    listEvaluationProcessesExpectedResultIndicator.initial = expectedResultIndicator.expectedResult.initial
    listEvaluationProcessesExpectedResultIndicator.description = expectedResultIndicator.expectedResult.description

    if (indicators) {
      listEvaluationProcessesExpectedResultIndicator.indicators = IndicatorDto.fromManyEntities(expectedResultIndicator.indicators)
    }

    const { targetAvaliations } = expectedResultIndicator

    if (targetAvaliations) {
      listEvaluationProcessesExpectedResultIndicator.projectsAvaliations = TargetAvaliationDto.fromManyEntities(targetAvaliations)
    }

    return listEvaluationProcessesExpectedResultIndicator
  }

  static fromManyEntities(expectedResult: Array<ExpectedResult>): Array<ListEvaluationProcessesExpectedResultIndicator> {
    const listEvaluationProcessesExpectedResultIndicator = expectedResult?.map(ListEvaluationProcessesExpectedResultIndicator.fromEntity)
    return listEvaluationProcessesExpectedResultIndicator || []
  }
}
