import { Evaluation, EvaluationIndicators, ExpectedResultIndicator } from '@modules/evaluation/entities'
import { ExpectedResult, ModelProcess, ModelLevel, Model } from '@modules/model/entities'
import { EntityManager, getConnection } from 'typeorm'

export class GenerateEvaluationIndicatorsService {
  public async generate(evaluationId: string): Promise<void> {
    await getConnection().transaction((manager: EntityManager) => {
      return this.generateWithTransaction(evaluationId, manager)
    })
  }

  public async generateWithTransaction(evaluationId: string, manager: EntityManager): Promise<void> {
    const evaluation = await this.findEvaluationById(evaluationId, manager)
    const evaluationIndicators = await this.buildEvaluationIndicatorsEntity(evaluation)
    await manager.save(evaluationIndicators)
  }

  private async findEvaluationById(evaluationId: string, manager: EntityManager): Promise<Evaluation> {
    const evaluation = await manager
      .createQueryBuilder(Evaluation, 'evaluation')
      .leftJoinAndSelect('evaluation.expectedModelLevel', 'expectedModelLevel')
      .leftJoinAndSelect('expectedModelLevel.model', 'model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .leftJoinAndSelect('model.modelProcesses', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .leftJoinAndSelect('expectedResult.minLevel', 'minLevel')
      .leftJoinAndSelect('expectedResult.maxLevel', 'maxLevel')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new Error()
    }

    return evaluation
  }

  private async buildEvaluationIndicatorsEntity(evaluation: Evaluation): Promise<EvaluationIndicators> {
    const evaluationIndicators = new EvaluationIndicators()

    evaluationIndicators.evaluation = evaluation
    evaluationIndicators.expectedResultIndicators = this.buildExpectedResultIndicators(
      evaluation.expectedModelLevel,
      evaluation.expectedModelLevel.model
    )

    return evaluationIndicators
  }

  private buildExpectedResultIndicators(
    expectedModelLevel: ModelLevel,
    model: Model
  ): ExpectedResultIndicator[] {
    const modelLevels = this.getEvaluationModelLevels(expectedModelLevel, model.modelLevels)
    const expectedResults = this.getExpectedResultsFromModel(modelLevels, model)
    const expectedResultIndicators = expectedResults.map((expectedResult) =>
      this.buildExpectedResultIndicator(expectedResult)
    )

    return expectedResultIndicators
  }

  private getEvaluationModelLevels(expectedModelLevel: ModelLevel, modelLevels: ModelLevel[]): ModelLevel[] {
    const evaluationModelLevels: ModelLevel[] = this.recursiveCall(expectedModelLevel, modelLevels, [
      expectedModelLevel
    ])

    return evaluationModelLevels
  }

  private recursiveCall(
    expectedModelLevel: ModelLevel,
    modelLevels: ModelLevel[],
    evaluationModelLevels: ModelLevel[]
  ): ModelLevel[] {
    const modelLevel = this.getPredecessorModelLevel(expectedModelLevel, modelLevels)
    if (modelLevel) {
      evaluationModelLevels.push(modelLevel)
      if (modelLevel.predecessor) {
        evaluationModelLevels.push(...this.recursiveCall(modelLevel, modelLevels, []))
      }
    }
    return evaluationModelLevels
  }

  private getPredecessorModelLevel(expectedModelLevel: ModelLevel, modelLevels: ModelLevel[]): ModelLevel {
    const predecessorModelLevel = modelLevels.find(
      (modelLevel) => modelLevel.initial === expectedModelLevel.predecessor
    )

    return predecessorModelLevel
  }

  private getExpectedResultsFromModel(modelLevels: ModelLevel[], model: Model): ExpectedResult[] {
    const expectedResults = model.modelProcesses.reduce((acc, modelProcess) => {
      const modelProcessExpectedResults = this.getExpectedResultsFromModelProcess(modelLevels, modelProcess)
      return [...acc, ...modelProcessExpectedResults]
    }, [] as ExpectedResult[])

    return expectedResults
  }

  private getExpectedResultsFromModelProcess(
    modelLevels: ModelLevel[],
    modelProcess: ModelProcess
  ): ExpectedResult[] {
    const modelLevelIds = this.getModelLevelsIds(modelLevels)
    const expectedResults = modelProcess.expectedResults.filter((expectedResult) =>
      modelLevelIds.includes(expectedResult.minLevel.id)
    )
    return expectedResults
  }

  private getModelLevelsIds(modelLevels: ModelLevel[]): string[] {
    const modelLevelsIds = modelLevels.map((modelLevel) => modelLevel.id)
    return modelLevelsIds
  }

  private buildExpectedResultIndicator(expectedResult: ExpectedResult): ExpectedResultIndicator {
    const expectedResultIndicator = new ExpectedResultIndicator()

    expectedResultIndicator.expectedResult = expectedResult

    return expectedResultIndicator
  }
}
