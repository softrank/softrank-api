import { SetModelCapacityIndicatorTargetAvaliationDto } from '@modules/evaluation/dtos/target-avaliation'
import { TargetAvaliationDto } from '@modules/evaluation/dtos/entities'
import { EvaluationProject, ModelCapacityIndicator, TargetAvaliation } from '@modules/evaluation/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { EvaluationProjectNotFoundError, ModelCapacityIndicatorNotFoundError } from '@modules/evaluation/errors'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { ModelProcess } from '@modules/model/entities'
import { ModelProcessNotFoundError } from '@modules/model/errors'
import { TargetAvaliationOwnerType, TargetAvaliationTypeEnum } from '@modules/evaluation/enums'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SetModelCapacityIndicatorTargetAvaliationService {
  constructor(
    @InjectRepository(ModelCapacityIndicator)
    private readonly modelCapacityIndicatorRepository: Repository<ModelCapacityIndicator>,
    @InjectRepository(TargetAvaliation)
    private readonly targetAvaliationRepository: Repository<TargetAvaliation>,
    @InjectRepository(EvaluationProject)
    private readonly evaluationProjectRepository: Repository<EvaluationProject>,
    @InjectRepository(ModelProcess)
    private readonly modelProcessRepository: Repository<ModelProcess>
  ) {}

  public async setTargetAvaliation(
    modelCapacityIndicatorId: string,
    setModelCapacityIndicatorTargetAvaliationDto: SetModelCapacityIndicatorTargetAvaliationDto
  ): Promise<TargetAvaliationDto> {
    const targetAvaliation = await getConnection().transaction((manager) => {
      return this.setTargetAvaliationWithTransaction(modelCapacityIndicatorId, setModelCapacityIndicatorTargetAvaliationDto, manager)
    })

    const targetAvaliationDto = TargetAvaliationDto.fromEntity(targetAvaliation)
    return targetAvaliationDto
  }

  public async setTargetAvaliationWithTransaction(
    modelCapacityIndicatorId: string,
    setModelCapacityIndicatorTargetAvaliationDto: SetModelCapacityIndicatorTargetAvaliationDto,
    manager: EntityManager
  ): Promise<TargetAvaliation> {
    const modelCapacityIndicator = await this.findModelCapacityIndicatorById(modelCapacityIndicatorId)
    const isProjectTarget = this.verifyIfTargetIsProject(modelCapacityIndicator)
    await this.verifyIfTargetIdExists(setModelCapacityIndicatorTargetAvaliationDto.targetId, isProjectTarget)
    const targetAvaliation = await this.findTargetAvaliation(
      modelCapacityIndicatorId,
      setModelCapacityIndicatorTargetAvaliationDto.targetId
    )

    const targetAvaliationToUpdate = this.setTargetAvaliationStatus(
      targetAvaliation,
      modelCapacityIndicatorId,
      setModelCapacityIndicatorTargetAvaliationDto,
      isProjectTarget
    )

    const updatedTargetAvaliation = await manager.save(targetAvaliationToUpdate)
    return updatedTargetAvaliation
  }

  private async findModelCapacityIndicatorById(modelCapacityIndicatorId: string): Promise<ModelCapacityIndicator> {
    const modelCapacityIndicator = await this.modelCapacityIndicatorRepository
      .createQueryBuilder('modelCapacityIndicator')
      .where('modelCapacityIndicator.id = :modelCapacityIndicatorId')
      .innerJoinAndSelect('modelCapacityIndicator.modelCapacity', 'modelCapacity')
      .setParameters({ modelCapacityIndicatorId })
      .getOne()

    if (!modelCapacityIndicator) {
      throw new ModelCapacityIndicatorNotFoundError()
    }

    return modelCapacityIndicator
  }

  private verifyIfTargetIsProject(modelCapacityIndicator: ModelCapacityIndicator): boolean {
    return modelCapacityIndicator.modelCapacity.type === ModelCapacityTypeEnum.PROJECT
  }

  private async verifyIfTargetIdExists(targetId: string, isProjectTarget: boolean): Promise<void> {
    if (isProjectTarget) {
      await this.verifyIfEvaluationProjectExists(targetId)
    } else {
      await this.verifyIfModelProcessExists(targetId)
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

  private async verifyIfModelProcessExists(modelProcessId: string): Promise<void> {
    const modelProcess = await this.modelProcessRepository
      .createQueryBuilder('modelProcess')
      .where('modelProcess.id = :modelProcessId')
      .setParameters({ modelProcessId })
      .getOne()

    if (!modelProcess) {
      throw new ModelProcessNotFoundError()
    }
  }

  private async findTargetAvaliation(modelCapacityIndicatorId: string, targetId: string): Promise<TargetAvaliation> {
    const targetAvaliation = await this.targetAvaliationRepository
      .createQueryBuilder('targetAvaliation')
      .where('targetAvaliation.ownerId = :modelCapacityIndicatorId')
      .andWhere('targetAvaliation.targetId = :targetId')
      .setParameters({ modelCapacityIndicatorId, targetId })
      .getOne()

    return targetAvaliation || new TargetAvaliation()
  }

  private setTargetAvaliationStatus(
    targetAvaliation: TargetAvaliation,
    modelCapacityIndicatorId: string,
    setModelCapacityIndicatorTargetAvaliationDto: SetModelCapacityIndicatorTargetAvaliationDto,
    isProjectTarget: boolean
  ): TargetAvaliation {
    targetAvaliation.ownerId = modelCapacityIndicatorId
    targetAvaliation.ownerType = TargetAvaliationOwnerType.MODEL_CAPACITY_INDICATOR
    targetAvaliation.targetId = setModelCapacityIndicatorTargetAvaliationDto.targetId
    targetAvaliation.targetType = isProjectTarget ? TargetAvaliationTypeEnum.EVALUATION_PROJECT : TargetAvaliationTypeEnum.MODEL_PROCESS
    targetAvaliation.status = setModelCapacityIndicatorTargetAvaliationDto.status

    return targetAvaliation
  }
}
