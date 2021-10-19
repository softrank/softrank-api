import { EvaluatorNotFoundError } from '@modules/evaluator/errors'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { Evaluator } from '@modules/evaluator/entities'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FindEvaluatorByIdService {
  constructor(@InjectRepository(Evaluator) private readonly evaluatorRepository: Repository<Evaluator>) {}

  public async find(evaluatorId: string): Promise<EvaluatorDto> {
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
