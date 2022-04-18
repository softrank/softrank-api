import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { ListEvaluationResponseDto, ListEvaluationsQueryDto } from '../dtos'
import { Evaluation } from '../entities'
import { EvaluationMemberType } from '../enums'

@Injectable()
export class ListEvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>
  ) {}

  public async list(listEvaluationsQueryDto: ListEvaluationsQueryDto): Promise<ListEvaluationResponseDto[]> {
    const evaluations = await this.listEvaluations(listEvaluationsQueryDto)
    const evaluationsDto = this.buildEvaluationDtos(evaluations)
    return evaluationsDto
  }

  private listEvaluations(listEvaluationsQueryDto: ListEvaluationsQueryDto): Promise<Evaluation[]> {
    const evaluationsQueryBuilder = this.evaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('evaluation.evaluationMembers', 'evaluationMember')
      .leftJoinAndSelect('evaluation.expectedModelLevel', 'modelLevel')
      .leftJoinAndSelect('modelLevel.model', 'model')
      .leftJoinAndSelect('evaluation.organizationalUnit', 'organizationalUnit')
      .leftJoinAndSelect('organizationalUnit.commonEntity', 'organizationalUnitCommonEntity')
      .where('true')

    if (listEvaluationsQueryDto.evaluatorId) {
      const typeBrackets = new Brackets((bracketsQueryBuilder) => {
        bracketsQueryBuilder
          .where('"evaluationMember".type = :leader')
          .orWhere('"evaluationMember".type = :adjunct')
      })

      evaluationsQueryBuilder
        .andWhere('"evaluationMember"."memberId" = :evaluatorId')
        .andWhere(typeBrackets)
        .setParameters({
          leader: EvaluationMemberType.EVALUATOR_LEADER,
          adjunct: EvaluationMemberType.EVALUATOR_ADJUNCT,
          evaluatorId: listEvaluationsQueryDto.evaluatorId
        })
    }

    if (listEvaluationsQueryDto.modelManagerId) {
      evaluationsQueryBuilder.andWhere('model."modelManagerId" = :modelManagerId').setParameters({
        modelManagerId: listEvaluationsQueryDto.modelManagerId
      })
    }

    if (listEvaluationsQueryDto.search) {
      evaluationsQueryBuilder
        .andWhere("unaccent(evaluation.name) ilike unaccent(concat('%', :search, '%')) ")
        .setParameters({
          search: listEvaluationsQueryDto.search
        })
    }

    const evaluations = evaluationsQueryBuilder.getMany()

    return evaluations
  }

  private buildEvaluationDtos(evaluations: Evaluation[]): ListEvaluationResponseDto[] {
    const evaluationDtos = evaluations.map(ListEvaluationResponseDto.fromEntity)
    return evaluationDtos
  }
}
