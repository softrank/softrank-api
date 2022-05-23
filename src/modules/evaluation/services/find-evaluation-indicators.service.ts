import {
  EvaluationIndicatorsDto,
  EvaluationIndicatorsFileDto,
  EvaluationIndicatorsIndicatorDto,
  EvaluationIndicatorsExpectedResultDto,
  EvaluationIndicatorsModelProcessDto,
  EvaluationIndicatorsModelLevelDto
} from '@modules/evaluation/dtos/evaluation-indicators'
import { Evaluation, EvaluationIndicators, ExpectedResultIndicator, Indicator, IndicatorFile } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { ModelLevel, ModelProcess } from '@modules/model/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { evaluationStateMapper } from '../enums'

interface ReducedEvaluationIndicators {
  [x: string]: {
    modelLevel: ModelLevel
    modelProcesses: ModelProcess[]
    expectedResultIndicators: ExpectedResultIndicator[]
  }
}

@Injectable()
export class FindEvaluationIndicatorsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(EvaluationIndicators)
    private readonly evaluationIndicatorsRepository: Repository<EvaluationIndicators>
  ) {}

  public async find(evaluationId: string): Promise<EvaluationIndicatorsDto> {
    await this.verifyEvaluationById(evaluationId)
    const evaluationIndicators = await this.findEvaluationIndicators(evaluationId)
    const reducedEvaluationIndicators = this.prepareDataToTransform(evaluationIndicators)
    const evaluationIndicatorsDto = this.buildEvaluationIndicatorsDto(evaluationIndicators, reducedEvaluationIndicators)

    return evaluationIndicatorsDto
  }

  private async verifyEvaluationById(evaluationId: string): Promise<void | never> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }
  }

  private async findEvaluationIndicators(evaluationId: string): Promise<EvaluationIndicators> {
    const evaluationIndicators = await this.evaluationIndicatorsRepository
      .createQueryBuilder('evaluationIndicators')
      .leftJoinAndSelect('evaluationIndicators.expectedResultIndicators', 'expectedResultIndicator')
      .innerJoinAndSelect('evaluationIndicators.evaluation', 'evaluation')
      .leftJoinAndSelect('expectedResultIndicator.expectedResult', 'expectedResult')
      .leftJoinAndSelect('expectedResult.minLevel', 'minModelLevel')
      .leftJoinAndSelect('expectedResult.modelProcess', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'recursiveExpectedResults')
      .leftJoinAndSelect('modelProcess.model', 'model')
      .leftJoinAndSelect('expectedResultIndicator.indicators', 'indicator')
      .leftJoinAndSelect('indicator.projects', 'project')
      .leftJoinAndSelect('indicator.files', 'indicatorFile')
      .leftJoinAndSelect('project.project', 'organizationalUnitProject')
      .where('evaluationIndicators.evaluationId = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    return evaluationIndicators
  }

  private prepareDataToTransform(evaluationIndicators: EvaluationIndicators): ReducedEvaluationIndicators {
    const reduced = evaluationIndicators.expectedResultIndicators.reduce((acc, expectedResultIndicator) => {
      const groupKey = expectedResultIndicator.expectedResult.minLevel.id
      const { modelProcess } = expectedResultIndicator.expectedResult

      if (acc[groupKey]) {
        acc[groupKey].expectedResultIndicators.push(expectedResultIndicator)
        if (this.shouldIncludeModelProcess(acc[groupKey].modelProcesses, modelProcess)) {
          acc[groupKey].modelProcesses.push(modelProcess)
        }
      } else {
        acc[groupKey] = {
          expectedResultIndicators: [expectedResultIndicator],
          modelLevel: expectedResultIndicator.expectedResult.minLevel,
          modelProcesses: [modelProcess]
        }
      }

      return acc
    }, {} as ReducedEvaluationIndicators)

    return reduced
  }

  private shouldIncludeModelProcess(modelProcesses: ModelProcess[], modelProcess: ModelProcess): boolean {
    const modelProcessesIds = modelProcesses.map((process) => process.id)
    return !modelProcessesIds.includes(modelProcess.id)
  }

  private buildEvaluationIndicatorsDto(
    evaluationIndicators: EvaluationIndicators,
    reducedEvaluationIndicators: ReducedEvaluationIndicators
  ): EvaluationIndicatorsDto {
    const evaluationIndicatorsDto = new EvaluationIndicatorsDto()

    evaluationIndicatorsDto.id = evaluationIndicators.id
    evaluationIndicatorsDto.evaluationId = evaluationIndicators.evaluation.id
    evaluationIndicatorsDto.state = evaluationStateMapper[evaluationIndicators.evaluation.state]
    evaluationIndicatorsDto.modelLevels = this.buildEvaluationIndicatorsModelLevelsDtos(reducedEvaluationIndicators)

    return evaluationIndicatorsDto
  }

  private buildEvaluationIndicatorsModelLevelsDtos(
    reducedEvaluationIndicators: ReducedEvaluationIndicators
  ): EvaluationIndicatorsModelLevelDto[] {
    const evaluationIndicatorsModelLevelsDtos: EvaluationIndicatorsModelLevelDto[] = []

    for (const groupKey in reducedEvaluationIndicators) {
      const { expectedResultIndicators, modelLevel, modelProcesses } = reducedEvaluationIndicators[groupKey]
      evaluationIndicatorsModelLevelsDtos.push(
        this.buildEvaluationIndicatorModelLevelDto(modelLevel, modelProcesses, expectedResultIndicators)
      )
    }
    return evaluationIndicatorsModelLevelsDtos
  }

  private buildEvaluationIndicatorModelLevelDto(
    modelLevel: ModelLevel,
    modelProcesses: ModelProcess[],
    expectedResultIndicators: ExpectedResultIndicator[]
  ): EvaluationIndicatorsModelLevelDto {
    const evaluationIndicatorsModelLevelDto = new EvaluationIndicatorsModelLevelDto()

    evaluationIndicatorsModelLevelDto.id = modelLevel.id
    evaluationIndicatorsModelLevelDto.name = modelLevel.name
    evaluationIndicatorsModelLevelDto.initial = modelLevel.initial
    evaluationIndicatorsModelLevelDto.modelProcess = this.buildEvaluationIndicatorsModelProcessesDtos(
      modelProcesses,
      expectedResultIndicators
    )

    return evaluationIndicatorsModelLevelDto
  }

  private buildEvaluationIndicatorsModelProcessesDtos(
    modelProcesses: ModelProcess[],
    expectedResultIndicators: ExpectedResultIndicator[]
  ): EvaluationIndicatorsModelProcessDto[] {
    const evaluationIndicatorsModelProcessesDtos = modelProcesses.map((modelProcess) => {
      const filteredExpectedResultIndicators = this.filterModelProcessExpectedResults(modelProcess.id, expectedResultIndicators)

      return this.buildEvaluationIndicatorsModelProcessDto(modelProcess, filteredExpectedResultIndicators)
    })

    return evaluationIndicatorsModelProcessesDtos
  }

  private filterModelProcessExpectedResults(
    modelProcessId: string,
    expectedResultsIndicators: ExpectedResultIndicator[]
  ): ExpectedResultIndicator[] {
    const filteredExpectedResultIndicators = expectedResultsIndicators.filter((expectedResultIndicator) => {
      const {
        expectedResult: { modelProcess }
      } = expectedResultIndicator

      return modelProcess.id === modelProcessId
    })

    return filteredExpectedResultIndicators
  }

  private buildEvaluationIndicatorsModelProcessDto(
    modelProcess: ModelProcess,
    expectedResultIndicators: ExpectedResultIndicator[]
  ): EvaluationIndicatorsModelProcessDto {
    const evaluationIndicatorsModelProcessDto = new EvaluationIndicatorsModelProcessDto()

    evaluationIndicatorsModelProcessDto.id = modelProcess.id
    evaluationIndicatorsModelProcessDto.name = modelProcess.name
    evaluationIndicatorsModelProcessDto.initial = modelProcess.initial
    evaluationIndicatorsModelProcessDto.description = modelProcess.description
    evaluationIndicatorsModelProcessDto.type = modelProcess.type
    evaluationIndicatorsModelProcessDto.expectedResults = this.buildEvaluationIndicatorsExpectedResultsDtos(expectedResultIndicators)

    return evaluationIndicatorsModelProcessDto
  }

  private buildEvaluationIndicatorsExpectedResultsDtos(
    expectedResultIndicators: ExpectedResultIndicator[]
  ): EvaluationIndicatorsExpectedResultDto[] {
    const evaluationIndicatorsExpectedResultsDtos = expectedResultIndicators.map((expectedResultIndicator) => {
      return this.buildEvaluationIndicatorsExpectedResultDto(expectedResultIndicator)
    })

    return evaluationIndicatorsExpectedResultsDtos
  }

  private buildEvaluationIndicatorsExpectedResultDto(
    expectedResultIndicator: ExpectedResultIndicator
  ): EvaluationIndicatorsExpectedResultDto {
    const { expectedResult } = expectedResultIndicator
    const evaluationIndicatorsExpectedResultDto = new EvaluationIndicatorsExpectedResultDto()

    evaluationIndicatorsExpectedResultDto.id = expectedResultIndicator.id
    evaluationIndicatorsExpectedResultDto.expectedResultId = expectedResult.id
    evaluationIndicatorsExpectedResultDto.name = expectedResult.name
    evaluationIndicatorsExpectedResultDto.initial = expectedResult.initial
    evaluationIndicatorsExpectedResultDto.description = expectedResult.description
    evaluationIndicatorsExpectedResultDto.indicators = this.buildEvaluationIndicatorsIndicatorsDtos(expectedResultIndicator.indicators)

    return evaluationIndicatorsExpectedResultDto
  }

  private buildEvaluationIndicatorsIndicatorsDtos(indicators: Indicator[]): EvaluationIndicatorsIndicatorDto[] {
    const evaluationIndicatorsIndicatorsDtos = indicators.map((indicator) => {
      return this.buildEvaluationIndicatorsIndicatorDto(indicator)
    })

    return evaluationIndicatorsIndicatorsDtos
  }

  private buildEvaluationIndicatorsIndicatorDto(indicator: Indicator): EvaluationIndicatorsIndicatorDto {
    const evaluationIndicatorsIndicatorDto = new EvaluationIndicatorsIndicatorDto()

    evaluationIndicatorsIndicatorDto.id = indicator.id
    evaluationIndicatorsIndicatorDto.name = indicator.name
    evaluationIndicatorsIndicatorDto.files = this.buildEvaluationIndicatorsFilesDtos(indicator.files)

    return evaluationIndicatorsIndicatorDto
  }

  private buildEvaluationIndicatorsFilesDtos(indicatorFiles: IndicatorFile[]): EvaluationIndicatorsFileDto[] {
    const evaluationIndicatorsFilesDtos = indicatorFiles.map(this.buildEvaluationIndicatorsFileDto)
    return evaluationIndicatorsFilesDtos
  }

  private buildEvaluationIndicatorsFileDto(indicatorFile: IndicatorFile): EvaluationIndicatorsFileDto {
    const evaluationIndicatorsFile = new EvaluationIndicatorsFileDto()

    evaluationIndicatorsFile.id = indicatorFile.id
    evaluationIndicatorsFile.name = indicatorFile.name
    evaluationIndicatorsFile.source = indicatorFile.source

    return evaluationIndicatorsFile
  }
}
