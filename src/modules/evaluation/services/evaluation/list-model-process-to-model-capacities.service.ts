import { ModelProcessDto } from '@modules/shared/dtos/model'
import { ModelProcessTypeEnum } from '@modules/model/enum'
import { ModelProcess } from '@modules/model/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Evaluation } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'

@Injectable()
export class ListModelProcessToOrganizationalModelCapacitiesIndicator {
  constructor(
    @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ModelProcess) private readonly modelProcessRepository: Repository<ModelProcess>
  ) {}

  public async list(evaluatoinId: string): Promise<ModelProcessDto[]> {
    await this.verifyIfEvaluationExists(evaluatoinId)
    const modelProcesses = await this.listEvaluationModelProcess(evaluatoinId)
    const modelProcessesDtos = ModelProcessDto.fromManyEntities(modelProcesses)

    return modelProcessesDtos
  }

  private async verifyIfEvaluationExists(evaluationId: string): Promise<void> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }
  }

  private async listEvaluationModelProcess(evaluationId: string): Promise<ModelProcess[]> {
    const modelProcess = await this.modelProcessRepository
      .createQueryBuilder('modelProcess')
      .where('modelProcess.type = :type')
      .andWhere(
        `
        exists (
          select
            1
          from
            model.expected_result er
          where
            er."modelProcessId" = "modelProcess".id
            and exists (
              select
                1
              from
                evaluation.expected_result_indicator eri
              join
                evaluation.evaluation_indicators ei
                on ei.id = eri."evaluationIndicatorsId"
              where
                eri."expectedResultId" = er.id
                and ei."evaluationId" = :evaluationId
            )
        
        )
      `
      )
      .setParameters({ evaluationId, type: ModelProcessTypeEnum.ORGANIZATIONAL })
      .getMany()

    return modelProcess
  }
}
