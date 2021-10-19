import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { Evaluator } from '@modules/evaluator/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { FindEvaluatorQueryDto } from '../dtos/find-evaluators-query.dto'

@Injectable()
export class FindEvaluatorsService {
  constructor(@InjectRepository(Evaluator) private readonly evaluatorRepository: Repository<Evaluator>) {}
  public async find(findEvaluatorQueryDto: FindEvaluatorQueryDto): Promise<EvaluatorDto[]> {
    const evaluators = await this.findEvaluatorsByQuery(findEvaluatorQueryDto)
    const evaluatorsDto = evaluators?.map(EvaluatorDto.fromEntity)

    return evaluatorsDto
  }

  private async findEvaluatorsByQuery(findEvaluatorQueryDto: FindEvaluatorQueryDto): Promise<Evaluator[]> {
    const queryBuilder = this.evaluatorRepository
      .createQueryBuilder('evaluator')
      .leftJoinAndSelect('evaluator.commonEntity', 'commonEntity')
      .leftJoinAndSelect('evaluator.evaluatorInstitution', 'evaluatorInstitution')
      .leftJoinAndSelect('evaluator.licenses', 'license')
      .leftJoinAndSelect('license.modelLevel', 'modelLevel')

    if (findEvaluatorQueryDto.name) {
      queryBuilder.andWhere('unaccent(commonEntity.name) ilike unaccent(:name)', {
        name: `%${findEvaluatorQueryDto.name}%`
      })
    }

    if (findEvaluatorQueryDto.documentNumber) {
      queryBuilder.andWhere('commonEntity.documentNumber like :documentNumber', {
        documentNumber: `${findEvaluatorQueryDto.documentNumber}%`
      })
    }

    if (findEvaluatorQueryDto.status) {
      queryBuilder.andWhere('evaluator.status = :status', {
        status: findEvaluatorQueryDto.status
      })
    }

    const evaluators = await queryBuilder.getMany()

    return evaluators
  }
}
