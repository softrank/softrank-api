import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { Injectable } from '@nestjs/common'
import { EvaluatorInstitution } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluatorInstitutionNotFoundError } from '../errors/evaluator-institution.errors'

@Injectable()
export class EvaluatorInstitutionMeService {
  constructor(
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>
  ) {}

  public async me(evaluatorInstitutionId: string): Promise<EvaluatorInstitutionDto> {
    const evaluatorInstitution = await this.findEvaluatorInstitutionById(evaluatorInstitutionId)

    return EvaluatorInstitutionDto.fromEntity(evaluatorInstitution)
  }

  private async findEvaluatorInstitutionById(evaluatorInstitutionId: string): Promise<EvaluatorInstitution> {
    const evaluatorInstitution = await this.evaluatorInstitutionRepository
      .createQueryBuilder('evaluatorInstitution')
      .leftJoinAndSelect('evaluatorInstitution.commonEntity', 'commonEntity')
      .leftJoinAndSelect('evaluatorInstitution.addresses', 'addresses')
      .where('evaluatorInstitution.id = :evaluatorInstitutionId', { evaluatorInstitutionId })
      .getOne()

    if (!evaluatorInstitution) {
      throw new EvaluatorInstitutionNotFoundError()
    }

    return evaluatorInstitution
  }
}
