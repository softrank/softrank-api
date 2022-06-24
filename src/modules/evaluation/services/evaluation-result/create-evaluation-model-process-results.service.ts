import { CreateEvaluationModelProcessResultDto } from '@modules/evaluation/dtos/evaluation-result'
import { Evaluation, EvaluationModelProcessResult } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { ModelLevelNotFoundError, ModelProcessNotFoundError } from '@modules/model/errors'
import { ModelLevel, ModelProcess } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluationModelProcessResultDto } from '@modules/evaluation/dtos/entities'

@Injectable()
export class CreateEvaluationModelProcessResultsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    @InjectRepository(ModelProcess)
    private readonly modelProcessRepository: Repository<ModelProcess>
  ) {}

  public async create(
    evaluationId: string,
    createEvaluationModelProcessResultDtos: CreateEvaluationModelProcessResultDto[]
  ): Promise<EvaluationModelProcessResultDto[]> {
    const evaluationModelProcessesResults = await getConnection().transaction((manager) => {
      return this.createWithTransaction(evaluationId, createEvaluationModelProcessResultDtos, manager)
    })

    const evaluationModelProcessResultDtos = EvaluationModelProcessResultDto.fromManyEntities(evaluationModelProcessesResults)
    return evaluationModelProcessResultDtos
  }

  public async createWithTransaction(
    evaluationId: string,
    createEvaluationModelProcessResultDtos: CreateEvaluationModelProcessResultDto[],
    manager: EntityManager
  ): Promise<EvaluationModelProcessResult[]> {
    const evaluation = await this.findEvaluationById(evaluationId)
    const evaluationModelProcessesResults = await this.buildEvaluationModelProcessesResults(
      evaluation,
      createEvaluationModelProcessResultDtos
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
    const modelProcess = await this.findModelProcessById(createEvaluationModelProcessResultDto.modelProcessId)
    const evaluationModelProcessResult = new EvaluationModelProcessResult()

    evaluationModelProcessResult.evaluation = evaluation
    evaluationModelProcessResult.evaluatedModelLevel = evaluatedModelLevel
    evaluationModelProcessResult.modelProcess = modelProcess
    evaluationModelProcessResult.result = createEvaluationModelProcessResultDto.result

    return evaluationModelProcessResult
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

  private async findModelProcessById(modelProcessId: string): Promise<ModelProcess> {
    const modelProcess = await this.modelProcessRepository
      .createQueryBuilder('ModelProcess')
      .where('ModelProcess.id = :modelProcessId')
      .setParameters({ modelProcessId })
      .getOne()

    if (!modelProcess) {
      throw new ModelProcessNotFoundError()
    }

    return modelProcess
  }
}