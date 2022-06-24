import { CreateEvaluationModelProcessResultDto } from '@modules/evaluation/dtos/evaluation-result'
import { Evaluation, EvaluationModelProcessResult } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { ModelLevel } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CreateEvaluationModelProcessResultsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>
  ) {}

  public async create(evaluationId: string, createEvaluationModelProcessResultDtos: CreateEvaluationModelProcessResultDto[]): Promise<any> {
    const evaluationModelProcessesResults = await getConnection().transaction((manager) => {
      return this.createWithTransaction(evaluationId, createEvaluationModelProcessResultDtos, manager)
    })
  }

  public async createWithTransaction(
    evaluationId: string,
    createEvaluationModelProcessResultDtos: CreateEvaluationModelProcessResultDto[],
    manager: EntityManager
  ): Promise<EvaluationModelProcessResult[]> {
    const evaluation = await this.findEvaluationById(evaluationId)
    return null
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
    createEvaluationModelProcessResultDtos: CreateEvaluationModelProcessResultDto[]
  ): Promise<EvaluationModelProcessResult[]> {
    const evaluationModelProcessesResults = createEvaluationModelProcessResultDtos.map((createEvaluationModelProcessResultDto) => {
      return this.buildEvaluationModelProcessResult(evaluation, createEvaluationModelProcessResultDto)
    })

    return Promise.all(evaluationModelProcessesResults)
  }

  private async buildEvaluationModelProcessResult(
    evaluation: Evaluation,
    createEvaluationModelProcessResultDto: CreateEvaluationModelProcessResultDto
  ): Promise<EvaluationModelProcessResult> {
    const evaluatedModelLevel = await this.findModelLevelById(createEvaluationModelProcessResultDto.expectedModelLevelId)
    const evaluationModelProcessResult = new EvaluationModelProcessResult()

    evaluationModelProcessResult.evaluation = evaluation
    evaluationModelProcessResult.evaluatedModelLevel = evaluatedModelLevel
    evaluationModelProcessResult.result = createEvaluationModelProcessResultDto.result

    return evaluationModelProcessResult
  }

  private async findModelLevelById(modelLevel: string): Promise<ModelLevel> {
    const ModelLevel = await this.modelLevelRepository
      .createQueryBuilder('modelLevel')
      .where('modelLevel.id = :ModelLevelId')
      .setParameters({ modelLevel })
      .getOne()

    if (!ModelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return ModelLevel
  }
}
