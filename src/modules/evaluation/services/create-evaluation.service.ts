import { EvaluationMemberStatusEnum, EvaluationStatusEnum, EvaluationMemberType } from '@modules/evaluation/enums'
import { EvaluationMemberDto, EvaluationProjectDto, EvaluationDto } from '@modules/shared/dtos/evaluation'
import { CreateEvaluationServiceDto, VerifiedCreateEvaluationDto } from '@modules/evaluation/dtos'
import { Evaluation, EvaluationMember, EvaluationProject } from '@modules/evaluation/entities'
import { OrganizationalUnitRepository } from '@modules/organizational-unit/repositories'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { OrganizationalUnitNotFound } from '@modules/organizational-unit/errors'
import { AuditorNotFoundError } from '@modules/auditor/errors/auditor.errors'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { EvaluatorCantBeChooseError } from '@modules/evaluation/errors'
import { EvaluatorRepository } from '@modules/evaluator/repositories'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { EvaluatorNotFoundError } from '@modules/evaluator/errors'
import { ModelLevelNotFoundError } from '@modules/model/errors'
import { ModelLevelDto } from '@modules/shared/dtos/model'
import { GenerateEvaluationIndicatorsService } from '.'
import { Evaluator } from '@modules/evaluator/entities'
import { CommonEntity } from '@modules/public/entities'
import { ModelLevel } from '@modules/model/entities'
import { Auditor } from '@modules/auditor/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateEvaluationService {
  constructor(
    private readonly evaluatorRepository: EvaluatorRepository,
    @InjectRepository(Auditor)
    private readonly auditorRepository: Repository<Auditor>,
    private readonly organizationalUnitRepository: OrganizationalUnitRepository,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    private readonly generateEvaluationIndicatorsService: GenerateEvaluationIndicatorsService,
    @InjectRepository(CommonEntity)
    private readonly commonEntityRepository: Repository<CommonEntity>
  ) {}

  public async create(createEvaluationServiceDto: CreateEvaluationServiceDto): Promise<EvaluationDto> {
    const evaluation = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluationServiceDto, manager)
    })

    const evaluationDto = this.transformToEvaluationDto(evaluation)
    return evaluationDto
  }

  public async createWithTransaction(createEvaluationServiceDto: CreateEvaluationServiceDto, manager: EntityManager): Promise<Evaluation> {
    const verifiedCreateEvaluation = await this.buildVerifiedCreateEvaluationDto(createEvaluationServiceDto)
    const evaluationEntity = this.buildEvaluationEntity(verifiedCreateEvaluation)
    const evaluation = await manager.save(evaluationEntity)
    await this.generateEvaluationIndicatorsService.generateWithTransaction(evaluation.id, manager)

    return evaluation
  }

  private async buildVerifiedCreateEvaluationDto(
    createEvaluationServiceDto: CreateEvaluationServiceDto
  ): Promise<VerifiedCreateEvaluationDto> {
    const auditor = await this.findAuditorById(createEvaluationServiceDto.auditorId)
    const evaluatorLeader = await this.findEvaluatorById(
      createEvaluationServiceDto.userId,
      createEvaluationServiceDto.evaluatorInstitutionId
    )
    const evaluatorsAdjuncts = await this.findEvaluatorAdjuncts(
      createEvaluationServiceDto.evaluatorsIds,
      createEvaluationServiceDto.evaluatorInstitutionId
    )
    const organizationalUnit = await this.findOrganizationalUnitById(createEvaluationServiceDto.organizationalUnitId)
    const expectedModelLevel = await this.findModelLevelById(createEvaluationServiceDto.expectedModelLevelId)

    const verifiedCreateEvaluationDto = new VerifiedCreateEvaluationDto()

    verifiedCreateEvaluationDto.name = createEvaluationServiceDto.name
    verifiedCreateEvaluationDto.start = createEvaluationServiceDto.start
    verifiedCreateEvaluationDto.end = createEvaluationServiceDto.end
    verifiedCreateEvaluationDto.implementationInstitution = createEvaluationServiceDto.implementationInstitution
    verifiedCreateEvaluationDto.auditor = auditor
    verifiedCreateEvaluationDto.evaluatorLeader = evaluatorLeader
    verifiedCreateEvaluationDto.evaluatorsAdjuncts = evaluatorsAdjuncts
    verifiedCreateEvaluationDto.organizationalUnit = organizationalUnit
    verifiedCreateEvaluationDto.expectedModelLevel = expectedModelLevel
    verifiedCreateEvaluationDto.projects = createEvaluationServiceDto.projects

    return verifiedCreateEvaluationDto
  }

  private async findEvaluatorAdjuncts(evaluatorsIds: string[], evaluatorInstitutionId: string): Promise<Evaluator[]> {
    const evaluatorsPromises = evaluatorsIds.map((evaluatorId: string) => {
      return this.findEvaluatorById(evaluatorId, evaluatorInstitutionId)
    })

    if (evaluatorsPromises.length) {
      const resolvedEvaluators = await Promise.all(evaluatorsPromises)
      return resolvedEvaluators
    }
  }

  private async findModelLevelById(modelLevelId: string): Promise<ModelLevel> {
    const modelLevel = await this.modelLevelRepository
      .createQueryBuilder('modelLevel')
      .where('modelLevel.id = :modelLevelId')
      .setParameters({ modelLevelId })
      .getOne()

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private async findEvaluatorById(evaluatorId: string, evaluatorInstitutionId: string): Promise<Evaluator> {
    const evaluator = await this.evaluatorRepository
      .createQueryBuilder('evaluator')
      .leftJoinAndSelect('evaluator.evaluatorInstitution', 'evaluatorInstitution')
      .where('evaluator.id = :evaluatorId')
      .setParameters({ evaluatorId })
      .getOne()

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    this.verifyEvaluator(evaluator, evaluatorInstitutionId)

    return evaluator
  }

  private verifyEvaluator(evaluator: Evaluator, evaluatorInstitutionId: string): void | never {
    if (evaluator.evaluatorInstitution.id !== evaluatorInstitutionId) {
      throw new EvaluatorCantBeChooseError()
    }
  }

  private async findAuditorById(auditorId: string): Promise<Auditor> {
    const auditor = await this.auditorRepository
      .createQueryBuilder('auditor')
      .where('auditor.id = :auditorId')
      .setParameters({ auditorId })
      .getOne()

    if (!auditor) {
      throw new AuditorNotFoundError()
    }

    return auditor
  }

  private async findOrganizationalUnitById(organizationalUnitId: string): Promise<OrganizationalUnit> {
    const organizationalUnit = await this.organizationalUnitRepository
      .createQueryBuilder('organizationalUnit')
      .leftJoinAndSelect('organizationalUnit.commonEntity', 'commonEntity')
      .where('organizationalUnit.id = :organizationalUnitId')
      .setParameters({ organizationalUnitId })
      .getOne()

    if (!organizationalUnit) {
      throw new OrganizationalUnitNotFound()
    }

    return organizationalUnit
  }

  private buildEvaluationEntity(verifiedCreateEvaluationDto: VerifiedCreateEvaluationDto): Evaluation {
    const evaluation = new Evaluation()

    evaluation.status = EvaluationStatusEnum.PENDING
    evaluation.name = verifiedCreateEvaluationDto.name
    evaluation.implementationInstitution = verifiedCreateEvaluationDto.implementationInstitution
    evaluation.start = verifiedCreateEvaluationDto.start as any
    evaluation.end = verifiedCreateEvaluationDto.end as any
    evaluation.expectedModelLevel = verifiedCreateEvaluationDto.expectedModelLevel
    evaluation.organizationalUnit = verifiedCreateEvaluationDto.organizationalUnit
    evaluation.evaluationMembers = this.buildEvaluationMembersEntities(verifiedCreateEvaluationDto)
    evaluation.projects = this.buildEvaluationProjects(verifiedCreateEvaluationDto.projects)

    return evaluation
  }

  private buildEvaluationProjects(projectNames: string[]): EvaluationProject[] {
    const evaluationProjects = projectNames.map(this.buildEvaluationProject)
    return evaluationProjects
  }

  private buildEvaluationProject(projectName: string): EvaluationProject {
    const evaluationProject = new EvaluationProject()

    evaluationProject.name = projectName

    return evaluationProject
  }

  private buildEvaluationMembersEntities(verifiedCreateEvaluationDto: VerifiedCreateEvaluationDto): EvaluationMember[] {
    const evaluationMembers: EvaluationMember[] = []

    evaluationMembers.push(
      this.buildEvaluationMemberEntity(verifiedCreateEvaluationDto.auditor.id, EvaluationMemberType.AUDITOR),
      this.buildEvaluationMemberEntity(verifiedCreateEvaluationDto.evaluatorLeader.id, EvaluationMemberType.EVALUATOR_LEADER),
      this.buildEvaluationMemberEntity(
        verifiedCreateEvaluationDto.evaluatorLeader.evaluatorInstitution.id,
        EvaluationMemberType.EVALUATOR_INSTITUTION
      )
    )

    verifiedCreateEvaluationDto.evaluatorsAdjuncts.forEach((evaluatorAdjunct) => {
      evaluationMembers.push(this.buildEvaluationMemberEntity(evaluatorAdjunct.id, EvaluationMemberType.EVALUATOR_ADJUNCT))
    })

    return evaluationMembers
  }

  private buildEvaluationMemberEntity(memberId: string, evaluationMemberType: EvaluationMemberType): EvaluationMember {
    const evaluationMember = new EvaluationMember()

    evaluationMember.status = EvaluationMemberStatusEnum.ACTIVE
    evaluationMember.type = evaluationMemberType
    evaluationMember.memberId = memberId

    return evaluationMember
  }

  private async transformToEvaluationDto(evaluation: Evaluation): Promise<EvaluationDto> {
    const membersPromises = evaluation.evaluationMembers.map((member) => {
      return this.transformToEvaluationMemberDto(member)
    })

    const resolvedMember = await Promise.all(membersPromises)

    const evaluationDto = new EvaluationDto()

    evaluationDto.id = evaluation.id
    evaluationDto.name = evaluation.name
    evaluationDto.implementationInstitution = evaluation.implementationInstitution
    evaluationDto.start = evaluation.start
    evaluationDto.end = evaluation.end
    evaluationDto.expectedModelLevel = ModelLevelDto.fromEntity(evaluation.expectedModelLevel)
    evaluationDto.organizationalUnit = OrganizationalUnitDto.fromEntity(evaluation.organizationalUnit)
    evaluationDto.members = resolvedMember
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
