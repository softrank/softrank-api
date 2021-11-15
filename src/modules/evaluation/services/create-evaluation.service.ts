import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateEvaluationServiceDto, VerifiedCreateEvaluationDto } from '../dtos'
import { ManagedService } from '../../shared/services/managed.service'
import { Evaluator } from '@modules/evaluator/entities'
import { EvaluatorRepository } from '../../evaluator/repositories/evaluator.repository'
import { Injectable } from '@nestjs/common'
import { EvaluatorNotFoundError } from '../../evaluator/errors/evaluator.errors'
import { Evaluation, EvaluationMember } from '../entities'
import { EvaluationMemberStatusEnum, EvaluationStatusEnum } from '../enums'
import { Auditor } from '@modules/auditor/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { AuditorNotFoundError } from '../../auditor/errors/auditor.errors'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { OrganizationalUnitRepository } from '../../organizational-unit/repositories/organizational-unit.repository'
import { OrganizationalUnitNotFound } from '../../organizational-unit/errors/organizational-unit.errors'
import { EvaluationMemberType } from '../enums/evaluation-member-type.enum'
import { ModelLevel } from '@modules/model/entities'
import { ModelLevelNotFoundError } from '../../model/errors/model-level.errors'
import { GenerateEvaluationIndicatorsService } from './generate-evaluation-indicators.service'

@Injectable()
export class CreateEvaluationService extends ManagedService {
  constructor(
    private readonly evaluatorRepository: EvaluatorRepository,
    @InjectRepository(Auditor)
    private readonly auditorRepository: Repository<Auditor>,
    private readonly organizationalUnitRepository: OrganizationalUnitRepository,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    private readonly generateEvaluationIndicatorsService: GenerateEvaluationIndicatorsService
  ) {
    super()
  }

  public async create(createEvaluationServiceDto: CreateEvaluationServiceDto): Promise<any> {
    const evaluation = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluationServiceDto, manager)
    })

    return evaluation
  }

  public async createWithTransaction(
    createEvaluationServiceDto: CreateEvaluationServiceDto,
    manager: EntityManager
  ): Promise<Evaluation> {
    this.setManager(manager)

    const verifiedCreateEvaluation = await this.buildVerifiedCreateEvaluationDto(createEvaluationServiceDto)
    const evaluationEntity = this.buildEvaluationEntity(verifiedCreateEvaluation)
    const evaluation = await this.manager.save(evaluationEntity)
    await this.generateEvaluationIndicatorsService.generateWithTransaction(evaluation.id, this.manager)

    this.cleanManager()
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
      createEvaluationServiceDto.implementationInstitutionId
    )
    const organizationalUnit = await this.findOrganizationalUnitById(
      createEvaluationServiceDto.organizationalUnitId
    )
    const expectedModelLevel = await this.findModelLevelById(createEvaluationServiceDto.expectedModelLevelId)

    const verifiedCreateEvaluationDto = new VerifiedCreateEvaluationDto()

    verifiedCreateEvaluationDto.auditor = auditor
    verifiedCreateEvaluationDto.evaluatorLeader = evaluatorLeader
    verifiedCreateEvaluationDto.evaluatorsAdjuncts = evaluatorsAdjuncts
    verifiedCreateEvaluationDto.organizationalUnit = organizationalUnit
    verifiedCreateEvaluationDto.expectedModelLevel = expectedModelLevel

    return verifiedCreateEvaluationDto
  }

  private async findEvaluatorAdjuncts(
    evaluatorsIds: string[],
    evaluatorInstitutionId: string
  ): Promise<Evaluator[]> {
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
    console.log(
      evaluator.evaluatorInstitution.id === evaluatorInstitutionId,
      evaluator.evaluatorInstitution.id,
      evaluatorInstitutionId
    )
    if (evaluator.evaluatorInstitution.id !== evaluatorInstitutionId) {
      throw new Error()
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
    evaluation.expectedModelLevel = verifiedCreateEvaluationDto.expectedModelLevel
    evaluation.organizationalUnit = verifiedCreateEvaluationDto.organizationalUnit
    evaluation.evaluationMembers = this.buildEvaluationMembersEntities(verifiedCreateEvaluationDto)

    return evaluation
  }

  private buildEvaluationMembersEntities(
    verifiedCreateEvaluationDto: VerifiedCreateEvaluationDto
  ): EvaluationMember[] {
    const evaluationMembers: EvaluationMember[] = []

    evaluationMembers.push(
      this.buildEvaluationMemberEntity(verifiedCreateEvaluationDto.auditor.id, EvaluationMemberType.AUDITOR),
      this.buildEvaluationMemberEntity(
        verifiedCreateEvaluationDto.evaluatorLeader.id,
        EvaluationMemberType.EVALUATOR_LEADER
      ),
      this.buildEvaluationMemberEntity(
        verifiedCreateEvaluationDto.evaluatorLeader.evaluatorInstitution.id,
        EvaluationMemberType.EVALUATOR_INSTITUTION
      )
    )

    verifiedCreateEvaluationDto.evaluatorsAdjuncts.forEach((evaluatorAdjunct) => {
      evaluationMembers.push(
        this.buildEvaluationMemberEntity(evaluatorAdjunct.id, EvaluationMemberType.EVALUATOR_ADJUNCT)
      )
    })

    return evaluationMembers
  }

  private buildEvaluationMemberEntity(
    memberId: string,
    evaluationMemberType: EvaluationMemberType
  ): EvaluationMember {
    const evaluationMember = new EvaluationMember()

    evaluationMember.status = EvaluationMemberStatusEnum.ACTIVE
    evaluationMember.type = evaluationMemberType
    evaluationMember.memberId = memberId

    return evaluationMember
  }
}