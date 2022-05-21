import { CommonEntity } from '@modules/public/entities'
import { EvaluationDto, EvaluationMemberDto, EvaluationProjectDto } from '@modules/shared/dtos/evaluation'
import { ModelLevelDto } from '@modules/shared/dtos/model'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EvaluationMember, Evaluation, EvaluationProject } from '../entities'
import { EvaluationMemberType } from '../enums'
import { EvaluationNotFoundError } from '../errors'

@Injectable()
export class FindEvaluationService {
  constructor(
    @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(CommonEntity) private readonly commonEntityRepository: Repository<CommonEntity>
  ) {}

  public async findById(evaluationId: string): Promise<EvaluationDto> {
    const evaluation = await this.findEvaluationById(evaluationId)
    const evaluationDto = await this.buildEvaluationDto(evaluation)

    return evaluationDto
  }

  private async findEvaluationById(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .innerJoinAndSelect('evaluation.expectedModelLevel', 'expectedModelLevel')
      .innerJoinAndSelect('evaluation.evaluationMembers', 'evaluationMember')
      .innerJoinAndSelect('evaluation.organizationalUnit', 'organizationalUnit')
      .innerJoinAndSelect('organizationalUnit.commonEntity', 'organizationalUnitCommonEntity')
      .innerJoinAndSelect('evaluation.projects', 'projects')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }

    return evaluation
  }

  private async buildEvaluationDto(evaluation: Evaluation): Promise<EvaluationDto> {
    const evaluationDto = new EvaluationDto()
    const membersPromises = evaluation.evaluationMembers.map((member) => {
      return this.transformToEvaluationMemberDto(member)
    })

    const resolvedMember = await Promise.all(membersPromises)

    evaluationDto.id = evaluation.id
    evaluationDto.name = evaluation.name
    evaluationDto.implementationInstitution = evaluation.implementationInstitution
    evaluationDto.start = evaluation.start
    evaluationDto.auditor = resolvedMember.find((member) => (member.type = EvaluationMemberType.AUDITOR))
    evaluationDto.evaluatorInsitution = resolvedMember.find((member) => (member.type = EvaluationMemberType.EVALUATOR_INSTITUTION))
    evaluationDto.evaluators = resolvedMember.filter(
      (member) => member.type === EvaluationMemberType.EVALUATOR_ADJUNCT || member.type === EvaluationMemberType.EVALUATOR_LEADER
    )
    evaluationDto.end = evaluation.end
    evaluationDto.expectedModelLevel = ModelLevelDto.fromEntity(evaluation.expectedModelLevel)
    evaluationDto.organizationalUnit = OrganizationalUnitDto.fromEntity(evaluation.organizationalUnit)
    evaluationDto.projects = this.buildEvaluationProjectsDtos(evaluation.projects)

    return evaluationDto
  }

  private buildEvaluationProjectsDtos(evaluationProjects: EvaluationProject[]): EvaluationProjectDto[] {
    const evaluationProjectDtos = evaluationProjects.map(this.buildEvaluationProjectDto)
    return evaluationProjectDtos
  }

  private buildEvaluationProjectDto(evaluationProject: EvaluationProject): EvaluationProjectDto {
    const evaluationProjectDto = new EvaluationProjectDto()

    evaluationProjectDto.id = evaluationProject.id
    evaluationProjectDto.name = evaluationProject.name

    return evaluationProjectDto
  }

  private async transformToEvaluationMemberDto(evaluationMember: EvaluationMember): Promise<EvaluationMemberDto> {
    const evaluationMemberDto = new EvaluationMemberDto()
    const commonEntity = await this.getCommonEntity(evaluationMember.memberId)

    evaluationMemberDto.id = evaluationMember.id
    evaluationMemberDto.memberId = evaluationMember.memberId
    evaluationMemberDto.type = evaluationMember.type
    evaluationMemberDto.name = commonEntity.name

    return evaluationMemberDto
  }

  private async getCommonEntity(memberId: string): Promise<CommonEntity> {
    const commonEntity = await this.commonEntityRepository
      .createQueryBuilder('commonEntity')
      .where('commonEntity.id = :memberId')
      .setParameters({ memberId })
      .getOne()

    return commonEntity
  }
}
