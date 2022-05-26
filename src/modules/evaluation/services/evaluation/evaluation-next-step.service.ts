import { EvaluationCanNotChangeStatusError, EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { EvaluationStateEnum } from '@modules/evaluation/enums'
import { EvaluationDto } from '@modules/shared/dtos/evaluation'
import { Evaluation } from '@modules/evaluation/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EvaluationNextStepService {
  constructor(@InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>) {}

  public async next(evaluationId: string): Promise<EvaluationDto> {
    const evaluation = await getConnection().transaction((manager) => {
      return this.nextWithTransaction(evaluationId, manager)
    })

    const evaluationDto = EvaluationDto.fromEntity(evaluation)
    return evaluationDto
  }

  public async nextWithTransaction(evaluationId: string, manager: EntityManager): Promise<Evaluation> {
    const evaluation = await this.findEvaluationById(evaluationId)
    const nextState = this.getNextStep(evaluation.state)
    const updatedEvaluation = this.updateNextStep(evaluation, nextState)
    await manager.save(updatedEvaluation)

    return updatedEvaluation
  }

  private async findEvaluationById(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError('Avaliação não encontrada.')
    }

    return evaluation
  }

  private getNextStep(evaluationState: EvaluationStateEnum): EvaluationStateEnum {
    if (evaluationState === EvaluationStateEnum.PENDING) {
      return EvaluationStateEnum.INITIAL_EVALUATION
    }

    if (evaluationState === EvaluationStateEnum.INITIAL_EVALUATION) {
      return EvaluationStateEnum.FINAL_EVALUATION
    }

    if (evaluationState === EvaluationStateEnum.FINAL_EVALUATION) {
      return EvaluationStateEnum.AUDITORING
    }

    if (evaluationState === EvaluationStateEnum.AUDITORING) {
      return EvaluationStateEnum.FINISHED
    }

    if (evaluationState === EvaluationStateEnum.REFUSED) {
      throw new EvaluationCanNotChangeStatusError('Avaliação recusada pelo gestor de modelo.')
    }

    if (evaluationState === EvaluationStateEnum.FINISHED) {
      throw new EvaluationCanNotChangeStatusError('Avaliação já finalizada.')
    }
  }

  private updateNextStep(evaluation: Evaluation, nextState: EvaluationStateEnum): Evaluation {
    evaluation.state = nextState
    return evaluation
  }
}
