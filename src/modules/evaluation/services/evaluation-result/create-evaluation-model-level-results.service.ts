import { CreateEvaluationModelLevelResultDto } from '@modules/evaluation/dtos/evaluation-result'
import { Evaluation, EvaluationModelLevelResult } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { ModelLevel } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluationModelLevelResultDto } from '@modules/evaluation/dtos/entities'

@Injectable()
export class CreateEvaluationModelLevelResultsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>
  ) {}

  public async create(
    evaluationId: string,
    createEvaluationModelLevelResultDtos: CreateEvaluationModelLevelResultDto[]
  ): Promise<EvaluationModelLevelResultDto[]> {
    const evaluationModelLevelsResults = await getConnection().transaction((manager) => {
      return this.createWithTransaction(evaluationId, createEvaluationModelLevelResultDtos, manager)
    })

    const evaluationModelLevelResultDtos = EvaluationModelLevelResultDto.fromManyEntities(evaluationModelLevelsResults)
    return evaluationModelLevelResultDtos
  }

  public async createWithTransaction(
    evaluationId: string,
    createEvaluationModelLevelResultDtos: CreateEvaluationModelLevelResultDto[],
    manager: EntityManager
  ): Promise<EvaluationModelLevelResult[]> {
    const evaluation = await this.findEvaluationById(evaluationId)
    const evaluationModelProcessesResults = await this.buildEvaluationModelProcessesResults(
      evaluation,
      createEvaluationModelLevelResultDtos
    )

    const savedEvaluationModelProcessesResults = await manager.save(evaluationModelProcessesResults)
    return savedEvaluationModelProcessesResults
  }

  private async findEvaluationById(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }

    return evaluation
  }

  private async buildEvaluationModelProcessesResults(
    evaluation: Evaluation,
    createEvaluationModelLevelResultDtos: CreateEvaluationModelLevelResultDto[]
  ): Promise<EvaluationModelLevelResult[]> {
    const evaluationModelProcessesResults = createEvaluationModelLevelResultDtos.map((createEvaluationModelLevelResultDto) => {
      return this.buildEvaluationModelLevelResult(evaluation, createEvaluationModelLevelResultDto)
    })

    return Promise.all(evaluationModelProcessesResults)
  }

  private async buildEvaluationModelLevelResult(
    evaluation: Evaluation,
    createEvaluationModelLevelResultDto: CreateEvaluationModelLevelResultDto
  ): Promise<EvaluationModelLevelResult> {
    const modelLevel = await this.findModelLevelById(createEvaluationModelLevelResultDto.modelLevelId)
    const evaluationModelLevelResult = new EvaluationModelLevelResult()

    evaluationModelLevelResult.evaluation = evaluation
    evaluationModelLevelResult.modelLevel = modelLevel
    evaluationModelLevelResult.result = createEvaluationModelLevelResultDto.result

    return evaluationModelLevelResult
  }

  private async findModelLevelById(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.modelLevelRepository
      .createQueryBuilder('modelLevel')
      .where('modelLevel.id = :modelLevelId')
      .setParameters({ modelLevelId })
      .getOne()

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }
}
