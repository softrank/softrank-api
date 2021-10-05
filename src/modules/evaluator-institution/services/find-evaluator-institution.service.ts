import { EvaluatorInstitutionNotFoundError } from '@modules/evaluator-institution/errors'
import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class FindEvaluatorInstitution {
  constructor(
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>
  ) {}

  public async findById(id: string): Promise<EvaluatorInstitutionDto> {
    const evaluatorInstitution = await this.findEvaluatorInstitutionById(id)
    return EvaluatorInstitutionDto.fromEntity(evaluatorInstitution)
  }

  private async findEvaluatorInstitutionById(id: string): Promise<EvaluatorInstitution> {
    const evaluatorInstitution = await this.evaluatorInstitutionRepository.findOne({
      where: { id },
      relations: ['addresses', 'commonEntity']
    })

    if (!evaluatorInstitution) {
      throw new EvaluatorInstitutionNotFoundError()
    }

    return evaluatorInstitution
  }
}
