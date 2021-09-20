import { Evaluator } from '@modules/evaluator/entities'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Evaluator)
export class EvaluatorRepository extends Repository<Evaluator> {
  public async findFullEvaluatorById(evaluatorId: string): Promise<Evaluator> {
    const evaluator = this.findOne({
      where: { id: evaluatorId },
      relations: ['commonEntity', 'licenses', 'licenses.modelLevel']
    })

    return evaluator
  }
}
