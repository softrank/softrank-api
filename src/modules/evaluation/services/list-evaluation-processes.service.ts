import { ListEvaluationProcessesQueryDto, ListEvaluationProcessesResponseDto } from '@modules/evaluation/dtos'
import { Model, ModelProcess } from '@modules/model/entities'
import { ModelRepository } from '@modules/model/repositories'
import { ModelNotFoundError } from '@modules/model/errors'
import { Evaluation } from '@modules/evaluation/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserIsNotAllowedToAccessThisEvaluationError } from '../errors'

export class ListEvaluationProcessesService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly modelRepository: ModelRepository,
    @InjectRepository(ModelProcess)
    private readonly modelProcessRepository: Repository<ModelProcess>
  ) {}

  public async list(listEvaluationProcessesQueryDto: ListEvaluationProcessesQueryDto): Promise<ListEvaluationProcessesResponseDto[]> {
    await this.verifyIfUserIsAllowed(listEvaluationProcessesQueryDto)
    const modelId = await this.findModelIdByEvaluationId(listEvaluationProcessesQueryDto.evaluationId)
    const modelProcesses = await this.findEvaluationProcesses(listEvaluationProcessesQueryDto.evaluationId, modelId)
    const listEvaluationProcessesResponseDtos = ListEvaluationProcessesResponseDto.fromManyEntities(modelProcesses)

    return listEvaluationProcessesResponseDtos
  }

  private async verifyIfUserIsAllowed(listEvaluationProcessesQueryDto: ListEvaluationProcessesQueryDto): Promise<void> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .innerJoin('evaluation.evaluationMembers', 'evaluationMember')
      .where('evaluationMember.memberId = :userId')
      .andWhere('evaluation.id = :evaluationId')
      .setParameters(listEvaluationProcessesQueryDto)
      .getOne()

    if (!evaluation) {
      throw new UserIsNotAllowedToAccessThisEvaluationError()
    }
  }

  private async findModelIdByEvaluationId(evaluationId: string): Promise<string> {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .innerJoin('model.modelLevels', 'modelLevel')
      .innerJoin('modelLevel.evaluations', 'evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model.id
  }

  private async findEvaluationProcesses(evaluationId: string, modelId: string): Promise<ModelProcess[]> {
    const modelProcesses = await this.modelProcessRepository
      .createQueryBuilder('modelProcess')
      .innerJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .innerJoinAndSelect('expectedResult.expectedResultIndicators', 'expectedResultIndicator')
      .leftJoinAndSelect('expectedResultIndicator.indicators', 'indicator')
      .leftJoinAndSelect('indicator.files', 'indicatorFiles')
      .where('"modelProcess"."modelId" = :modelId')
      .andWhere(
        `
          exists (
            select
              1
            from
              evaluation.evaluation_indicators evaluationIndicators
            where
              "expectedResultIndicator"."expectedResultId" = expectedResult.id
              and evaluationIndicators.id = "expectedResultIndicator"."evaluationIndicatorsId"
              and evaluationIndicators."evaluationId" = :evaluationId
          )
      `
      )
      .setParameters({ modelId, evaluationId })
      .getMany()

    return modelProcesses
  }
}
