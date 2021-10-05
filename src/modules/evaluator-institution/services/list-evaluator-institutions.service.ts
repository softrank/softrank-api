import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class ListEvaluatorInstitutionsService {
  constructor(
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>
  ) {}
  public async list(): Promise<EvaluatorInstitutionDto[]> {
    const evaluatorInstitutions = await this.listEvaluatorInstitutions()
    const mappedEvaluatorInstitution = this.mapToEvaluatorInstitutionDto(evaluatorInstitutions)

    return mappedEvaluatorInstitution
  }

  private async listEvaluatorInstitutions(): Promise<EvaluatorInstitution[]> {
    const evaluatorInstitutions = await this.evaluatorInstitutionRepository.find({
      relations: ['addresses', 'commonEntity']
    })

    return evaluatorInstitutions
  }

  private mapToEvaluatorInstitutionDto(
    evaluatorInstitutions: EvaluatorInstitution[]
  ): EvaluatorInstitutionDto[] {
    return evaluatorInstitutions.map(EvaluatorInstitutionDto.fromEntity)
  }
}
