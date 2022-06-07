import { EvaluationPlan } from '@modules/evaluation/entities'
import { EvaluationPlanNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class DeleteEvaluationPlanService {
  constructor(@InjectRepository(EvaluationPlan) private readonly evaluationPlanRepository: Repository<EvaluationPlan>) {}

  public async delete(evaluationPlanId: string): Promise<void> {
    await getConnection().transaction((manager) => {
      return this.deleteWithTransaction(evaluationPlanId, manager)
    })
  }

  public async deleteWithTransaction(evaluationPlanId: string, manager: EntityManager): Promise<void> {
    const evaluationPlan = await this.findEvaluationById(evaluationPlanId)
    const deletedEvaluationPlan = this.softDeleteEvaluationPlan(evaluationPlan)
    await manager.save(deletedEvaluationPlan)
  }

  private async findEvaluationById(evaluationPlanId: string): Promise<EvaluationPlan> {
    const evaluationPlan = await this.evaluationPlanRepository
      .createQueryBuilder('evaluationPlan')
      .where('evaluationPlan.id = :evaluationPlanId')
      .setParameters({ evaluationPlanId })
      .getOne()

    if (!evaluationPlan) {
      throw new EvaluationPlanNotFoundError()
    }

    return evaluationPlan
  }

  private softDeleteEvaluationPlan(evaluationPlan: EvaluationPlan): EvaluationPlan {
    evaluationPlan.deletedAt = new Date()
    return evaluationPlan
  }
}
