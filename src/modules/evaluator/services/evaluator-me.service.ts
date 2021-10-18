import { EvaluatorDto } from '../../shared/dtos/evaluator/evaluator.dto'
import { Evaluator } from '../entities/evaluator.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluatorNotFoundError } from '../errors/evaluator.errors'
import { Injectable } from '@nestjs/common'

@Injectable()
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
      .leftJoinAndSelect('evaluator.evaluatorInstitution', 'evaluatorInstitution')
      .leftJoinAndSelect('evaluator.licenses', 'license')
      .leftJoinAndSelect('license.modelLevel', 'modelLevel')
      .where('evaluator.id = :evaluatorId', { evaluatorId })
      .getOne()

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }
}
