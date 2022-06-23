import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { Evaluation } from '@modules/evaluation/entities'
import { EntityManager, getConnection } from 'typeorm'

export class GenerateEvaluationModelCapacityIndicatorsService {
  public async generate(evaluationId: string): Promise<void> {
    await getConnection().transaction(async (manager) => {
      await this.generateWithTransaction(evaluationId, manager)
    })
  }

  public async generateWithTransaction(evaluationId: string, manager: EntityManager): Promise<void> {
    await this.verifyIfEvaluationExists(evaluationId, manager)
    await this.populateEvaluationModelCapacityIndicators(evaluationId, manager)
  }

  private async verifyIfEvaluationExists(evaluationId: string, manager: EntityManager): Promise<void> {
    const evaluation = await manager
      .createQueryBuilder(Evaluation, 'evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }
  }

  private async populateEvaluationModelCapacityIndicators(evaluationId: string, manager: EntityManager): Promise<void> {
    await manager.query(
      `
    with recursive modelLevel as (
      select
        ml.*
      from
        model.model_level ml
      where
        exists (
        select
          1
        from
          evaluation.evaluation e
        where
          e."id" = $1::uuid
          and e."expectedModelLevelId" = ml.id
      )
      union (
      select
        ml2.*
      from
        model.model_level ml2
      join
          modelLevel
          on
        modelLevel.predecessor = ml2.initial
        and modelLevel."modelId" = ml2."modelId"
          )
        )
      insert into evaluation.model_capacity_indicator (
        "evaluationId",
        "modelCapacityId"
      ) select
        $1::uuid,
        mc.id
      from
        model.model_capacity mc
      where
        exists (
          select
            1
          from
            modelLevel ml
          join
            model.model_level ml3
            on ml3.id = mc."minModelLevelId" 
          where
            ml."modelId" = mc."modelId"
            and ml.initial = ml3.initial 
        ) and not exists (
          select
            1
          from
            modelLevel ml
          join
            model.model_level ml4
            on ml4.id = mc."maxModelLevelId" 
          where
            ml."modelId" = mc."modelId" 
            and ml.predecessor = ml4.initial
        )
    `,
      [evaluationId]
    )
  }
}
