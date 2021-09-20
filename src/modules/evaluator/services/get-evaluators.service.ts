import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { Evaluator } from '@modules/evaluator/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class GetEvaluatorsService {
  constructor(@InjectRepository(Evaluator) private readonly evaluatorRepository: Repository<Evaluator>) {}
  public async getEvaluators(): Promise<EvaluatorDto[]> {
    const evaluators = await this.findEvaluators()
    const evaluatorsDto = evaluators?.map(EvaluatorDto.fromEntity)

    return evaluatorsDto
  }

  private async findEvaluators(): Promise<Evaluator[]> {
    const evaluators = await this.evaluatorRepository.find({
      relations: ['commonEntity', 'licenses', 'licenses.modelLevel']
    })

    return evaluators
  }
}
