import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ListEvaluatorInstitutionQueryDto } from '../dtos/list-evaluator-institution-query.dto'

@Injectable()
export class ListEvaluatorInstitutionsService {
  constructor(
    @InjectRepository(EvaluatorInstitution)
    private readonly evaluatorInstitutionRepository: Repository<EvaluatorInstitution>
  ) {}
  public async list(listEvaluatorInstitutionQueryDto: ListEvaluatorInstitutionQueryDto): Promise<EvaluatorInstitutionDto[]> {
    const evaluatorInstitutions = await this.listEvaluatorInstitutionsByQuery(listEvaluatorInstitutionQueryDto)
    const mappedEvaluatorInstitution = this.mapToEvaluatorInstitutionDto(evaluatorInstitutions)

    return mappedEvaluatorInstitution
  }

  private listEvaluatorInstitutionsByQuery(
    listEvaluatorInstitutionQueryDto: ListEvaluatorInstitutionQueryDto
  ): Promise<EvaluatorInstitution[]> {
    const queryBuilder = this.evaluatorInstitutionRepository
      .createQueryBuilder('evaluatorInstitution')
      .leftJoinAndSelect('evaluatorInstitution.addresses', 'address')
      .leftJoinAndSelect('evaluatorInstitution.commonEntity', 'commonEntity')

    if (listEvaluatorInstitutionQueryDto.name) {
      queryBuilder.andWhere('unaccent(commonEntity.name) ilike unaccent(:name)', {
        name: `%${listEvaluatorInstitutionQueryDto.name}%`
      })
    }

    if (listEvaluatorInstitutionQueryDto.documentNumber) {
      queryBuilder.andWhere('commonEntity.documentNumber like :documentNumber', {
        documentNumber: `${listEvaluatorInstitutionQueryDto.documentNumber}%`
      })
    }

    if (listEvaluatorInstitutionQueryDto.status) {
      queryBuilder.andWhere('evaluatorInstitution.status = :status', {
        status: listEvaluatorInstitutionQueryDto.status
      })
    }

    const evaluatorInstitutions = queryBuilder.getMany()
    return evaluatorInstitutions
  }

  private mapToEvaluatorInstitutionDto(evaluatorInstitutions: EvaluatorInstitution[]): EvaluatorInstitutionDto[] {
    return evaluatorInstitutions.map((evaluatiorInstitution) => EvaluatorInstitutionDto.fromEntity(evaluatiorInstitution))
  }
}
