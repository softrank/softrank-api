import { Indicator } from '@modules/evaluation/entities'
import { ListEvaluationProcessesIndicatorFile } from './list-evaluation-processes-indicator-file.dto'

export class ListEvaluationProcessesIndicator {
  id: string
  name: string
  files: ListEvaluationProcessesIndicatorFile[]

  static fromEntity(indicator: Indicator): ListEvaluationProcessesIndicator {
    const listEvaluationProcessesIndicator = new ListEvaluationProcessesIndicator()

    listEvaluationProcessesIndicator.id = indicator.id
    listEvaluationProcessesIndicator.name = indicator.name
    listEvaluationProcessesIndicator.files = ListEvaluationProcessesIndicatorFile.fromManyEntities(indicator.files)

    return listEvaluationProcessesIndicator
  }

  static fromManyEntities(indicators: Array<Indicator>): Array<ListEvaluationProcessesIndicator> {
    const listEvaluationProcessesIndicator = indicators.map(ListEvaluationProcessesIndicator.fromEntity)
    return listEvaluationProcessesIndicator
  }
}
