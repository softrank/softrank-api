import { EvaluatorLicenseType } from '@modules/evaluator/enums'
import { Model, ModelLevel } from '@modules/model/entities'
import { ModelRepository } from '@modules/model/repositories'
import { ModelDto } from '@modules/shared/dtos/model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ListEvaluatorModelsService {
  constructor(private readonly modelRepository: ModelRepository) {}
  public async list(evaluatorId: string): Promise<ModelDto[]> {
    const evaluatorModels = await this.findEvaluatorModels(evaluatorId)
    const modelDtos = ModelDto.fromManyEntities(evaluatorModels)

    return modelDtos
  }

  private async findEvaluatorModels(evaluationId: string): Promise<Model[]> {
    const evaluatorModelLevelsIds = await this.listEvaluatorModelLevelsIds(evaluationId)

    if (evaluatorModelLevelsIds.length) {
      const model = await this.modelRepository
        .createQueryBuilder('model')
        .innerJoinAndSelect('model.modelLevels', 'modelLevel')
        .where('modelLevel.id in (:...evaluatorModelLevelsIds)')
        .setParameters({ evaluationId, evaluatorModelLevelsIds })
        .getMany()

      return model
    }
  }

  private async listEvaluatorModelLevelsIds(evaluatorId: string): Promise<string[]> {
    const modelLevels: ModelLevel[] = await this.modelRepository.query(
      `
      with recursive modelLevel as (
        select
          ml.*
        from
          model.model_level ml
        where exists (
          select 
            1
          from
            evaluator.evaluator_license el
          where
            el."evaluatorId" = $1::uuid
            and el."modelLevelId" = ml.id
            and el.type = $2
        )
        union (
          select
            ml2.*
          from
            model.model_level ml2
          join
            modelLevel
            on modelLevel.predecessor  = ml2.initial
            and modelLevel."modelId" = ml2."modelId"
        )
      ) select * from modelLevel
    `,
      [evaluatorId, EvaluatorLicenseType.LEADER]
    )

    const modelLevelsIds = modelLevels.map((modelLevel) => modelLevel.id)
    return modelLevelsIds
  }
}
