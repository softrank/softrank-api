import { EvaluatorDto } from '../../shared/dtos/evaluator/evaluator.dto'
import { Evaluator } from '../entities/evaluator.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluatorNotFoundError } from '../errors/evaluator.errors'

export class EvaluatorMeService {
  constructor(@InjectRepository(Evaluator) private readonly evaluatorRepository: Repository<Evaluator>) {}

  public async me(evaluatorId: string): Promise<EvaluatorDto> {
    const evaluator = await this.findEvaluatorById(evaluatorId)

    return EvaluatorDto.fromEntity(evaluator)
  }

  private async findEvaluatorById(evaluatorId: string): Promise<Evaluator> {
    const evaluator = await this.evaluatorRepository
      .createQueryBuilder('evaluator')
      .leftJoinAndSelect('evaluator.commonEntity', 'commonEntity')
      .leftJoinAndSelect('evaluator.commonEntity', 'evaluatorInstitution')
      .where('evaluator.id = :evaluatorId', { evaluatorId })
      .getOne()

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }
}
