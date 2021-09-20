import { EvaluatorNotFoundError } from '@modules/evaluator/errors'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { Evaluator } from '@modules/evaluator/entities'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class GetEvaluatorService {
  constructor(@InjectRepository(Evaluator) private readonly evaluatorRepository: Repository<Evaluator>) {}
  public async getEvaluator(evaluatorId: string): Promise<EvaluatorDto> {
    const evaluator = await this.findEvaluator(evaluatorId)
    return EvaluatorDto.fromEntity(evaluator)
  }

  private async findEvaluator(evaluatorId: string): Promise<Evaluator> {
    const evaluator = await this.evaluatorRepository.findOne({
      where: { id: evaluatorId },
      relations: ['licenses', 'commonEntity', 'licenses.modelLevel']
    })

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }
}
