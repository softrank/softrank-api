import { TargetAvaliationDto } from '@modules/evaluation/dtos/entities'
import { SetExpectedResultIndicatorProjectAvaliationDto } from '@modules/evaluation/dtos/target-avaliation'
import { EvaluationProject, ExpectedResultIndicator, TargetAvaliation } from '@modules/evaluation/entities'
import { TargetAvaliationOwnerType, TargetAvaliationStatusEnum, TargetAvaliationTypeEnum } from '@modules/evaluation/enums'
import { EvaluationProjectNotFoundError, ExpectedResultIndicatorNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class SetExpectedResultIndicatorProjecAvaliationService {
  constructor(
    @InjectRepository(ExpectedResultIndicator)
    private readonly expectedResultIndicatorRepository: Repository<ExpectedResultIndicator>,
    @InjectRepository(TargetAvaliation)
    private readonly targetAvaliationRepository: Repository<TargetAvaliation>,
    @InjectRepository(EvaluationProject)
    private readonly evaluationProjectRepository: Repository<EvaluationProject>
  ) {}

  public async setAvaliation(
    expectedResultIndicatorId: string,
    setExpectedResultIndicatorProjectAvaliationDto: SetExpectedResultIndicatorProjectAvaliationDto
  ): Promise<TargetAvaliationDto> {
    const targetAvaliation = await getConnection().transaction((manager) => {
      return this.setAvaliationWithTransaction(expectedResultIndicatorId, setExpectedResultIndicatorProjectAvaliationDto, manager)
    })

    const targetAvaliationDto = TargetAvaliationDto.fromEntity(targetAvaliation)
    return targetAvaliationDto
  }

  public async setAvaliationWithTransaction(
    expectedResultIndicatorId: string,
    setExpectedResultIndicatorProjectAvaliationDto: SetExpectedResultIndicatorProjectAvaliationDto,
    manager: EntityManager
  ): Promise<TargetAvaliation> {
    await this.verifyIfExpectedResultIndicatorExists(expectedResultIndicatorId)
    await this.verifyIfEvaluationProjectExists(setExpectedResultIndicatorProjectAvaliationDto.evaluationProjectId)
    const targetAvaliation = await this.findTargetAvaliation(
      expectedResultIndicatorId,
      setExpectedResultIndicatorProjectAvaliationDto.evaluationProjectId
    )

    const targetAvaliationToUpdate = this.setTargetAvaliationStatus(
      targetAvaliation,
      expectedResultIndicatorId,
      setExpectedResultIndicatorProjectAvaliationDto
    )

    const updatedTargetAvaluation = await manager.save(targetAvaliationToUpdate)
    return updatedTargetAvaluation
  }

  private async verifyIfExpectedResultIndicatorExists(expectedResultIndicatorId: string): Promise<void> {
    const expectedResultIndicator = await this.expectedResultIndicatorRepository
      .createQueryBuilder('expectedResultIndicator')
      .where('expectedResultIndicator.id = :expectedResultIndicatorId')
      .setParameters({ expectedResultIndicatorId })
      .getOne()

    if (!expectedResultIndicator) {
      throw new ExpectedResultIndicatorNotFoundError()
    }
  }

  private async verifyIfEvaluationProjectExists(evaluationProjectId: string): Promise<void> {
    const evaluationProject = await this.evaluationProjectRepository
      .createQueryBuilder('evaluationProject')
      .where('evaluationProject.id = :evaluationProjectId')
      .setParameters({ evaluationProjectId })
      .getOne()

    if (!evaluationProject) {
      throw new EvaluationProjectNotFoundError()
    }
  }

  private async findTargetAvaliation(expectedResultIndicatorId: string, evaluationProjectId: string): Promise<TargetAvaliation> {
    const targetAvaliation = await this.targetAvaliationRepository
      .createQueryBuilder('targetAvaliation')
      .where('targetAvaliation.ownerId = :expectedResultIndicatorId')
      .andWhere('targetAvaliation.targetId = :evaluationProjectId')
      .setParameters({ expectedResultIndicatorId, evaluationProjectId })
      .getOne()

    return targetAvaliation || new TargetAvaliation()
  }

  private setTargetAvaliationStatus(
    targetAvaliation: TargetAvaliation,
    expectedResultIndicatorId: string,
    setExpectedResultIndicatorProjectAvaliationDto: SetExpectedResultIndicatorProjectAvaliationDto
  ): TargetAvaliation {
    targetAvaliation.ownerId = expectedResultIndicatorId
    targetAvaliation.ownerType = TargetAvaliationOwnerType.EXPECTED_RESULT_INDICATOR
    targetAvaliation.targetId = setExpectedResultIndicatorProjectAvaliationDto.evaluationProjectId
    targetAvaliation.targetType = TargetAvaliationTypeEnum.EVALUATION_PROJECT
    targetAvaliation.status = setExpectedResultIndicatorProjectAvaliationDto.status

    return targetAvaliation
  }
}
