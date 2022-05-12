import { ExpectedResultIndicator } from '@modules/evaluation/entities'
import { ExpectedResult } from '@modules/model/entities'
import { ListEvaluationProcessesIndicator } from './list-evaluation-processes-indicator.dto'

export class ListEvaluationProcessesExpectedResultIndicator {
  id: string
  expectedResultId: string
  name: string
  initial: string
  description: string
  indicators: Array<ListEvaluationProcessesIndicator>

  static fromEntity(expectedResult: ExpectedResult): ListEvaluationProcessesExpectedResultIndicator {
    const {
      expectedResultIndicators: [expectedResultIndicator]
    } = expectedResult
    expectedResultIndicator.expectedResult = expectedResult

    const listEvaluationProcessesExpectedResultIndicator = new ListEvaluationProcessesExpectedResultIndicator()

    listEvaluationProcessesExpectedResultIndicator.id = expectedResultIndicator.id
    listEvaluationProcessesExpectedResultIndicator.expectedResultId = expectedResultIndicator.expectedResult.id
    listEvaluationProcessesExpectedResultIndicator.name = expectedResultIndicator.expectedResult.name
    listEvaluationProcessesExpectedResultIndicator.initial = expectedResultIndicator.expectedResult.initial
    listEvaluationProcessesExpectedResultIndicator.description = expectedResultIndicator.expectedResult.description
    listEvaluationProcessesExpectedResultIndicator.indicators = ListEvaluationProcessesIndicator.fromManyEntities(
      expectedResultIndicator.indicators
    )

    return listEvaluationProcessesExpectedResultIndicator
  }

  static fromManyEntities(expectedResult: Array<ExpectedResult>): Array<ListEvaluationProcessesExpectedResultIndicator> {
    const listEvaluationProcessesExpectedResultIndicator = expectedResult.map(ListEvaluationProcessesExpectedResultIndicator.fromEntity)

    return listEvaluationProcessesExpectedResultIndicator
  }
}
