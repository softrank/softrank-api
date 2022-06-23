import { Indicator, EvaluationProject, EvidenceSource, EvidenceSourceFile, Evaluation } from '@modules/evaluation/entities'
import { IndicatorNotFoundError, EvaluationNotFoundError, EvaluationProjectNotFoundError } from '@modules/evaluation/errors'
import { FileManagerAdapterService } from '@modules/file-manager/services'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { UploadFileDto } from '@modules/file-manager/dtos'
import { EvidenceSourceDto } from '../dtos/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluationStateEnum } from '../enums'
import { Injectable } from '@nestjs/common'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { ModelProcess } from '@modules/model/entities'
import { ModelProcessNotFoundError } from '@modules/model/errors'

@Injectable()
export class UploadEvidenceSourceService {
  constructor(
    @InjectRepository(Indicator)
    private readonly indicatorRepository: Repository<Indicator>,
    @InjectRepository(EvaluationProject)
    private readonly evaluationProjectRepository: Repository<EvaluationProject>,
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ModelProcess)
    private readonly modelProcessRepository: Repository<ModelProcess>,
    private readonly fileManagerAdapterService: FileManagerAdapterService
  ) {}

  public async upload(uploadIndicatorFileDto: UploadIndicatorFileDto): Promise<EvidenceSourceDto> {
    const evidenceSource = await getConnection().transaction((manager) => {
      return this.uploadWithTransaction(uploadIndicatorFileDto, manager)
    })

    const evidenceSourceDto = EvidenceSourceDto.fromEntity(evidenceSource)
    return evidenceSourceDto
  }

  public async uploadWithTransaction(uploadIndicatorFileDto: UploadIndicatorFileDto, manager: EntityManager): Promise<EvidenceSource> {
    const indicator = await this.findIndicatorById(uploadIndicatorFileDto.indicatorId)
    const isAProjectTarget = this.isAProjectTarget(indicator)
    const target = await this.findTargetById(uploadIndicatorFileDto.targetId, isAProjectTarget)
    const url = await this.uploadFile(uploadIndicatorFileDto)
    const evaluationState = await this.getEvaluationState(indicator)
    const evidenceSourceToCreate = this.buildEvidenceSource(indicator, url, uploadIndicatorFileDto, target, evaluationState)
    const evidenceSource = await manager.save(evidenceSourceToCreate)

    return evidenceSource
  }

  private isAProjectTarget(indicator: Indicator): boolean {
    const isExpectedResultIndicator = Boolean(indicator.expectedResultIndicator)
    const isProjectModelCapacityIndicator = Boolean(indicator.modelCapacityIndicator?.modelCapacity?.type === ModelCapacityTypeEnum.PROJECT)

    return isExpectedResultIndicator || isProjectModelCapacityIndicator
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
      .leftJoinAndSelect('indicator.expectedResultIndicator', 'expectedResultIndicator')
      .leftJoinAndSelect('indicator.modelCapacityIndicator', 'modelCapacityIndicator')
      .leftJoinAndSelect('modelCapacityIndicator.modelCapacity', 'modelCapacity')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError()
    }

    return indicator
  }

  private async findTargetById(targetId: string, isAProjectTarget: boolean): Promise<EvaluationProject | ModelProcess> {
    if (isAProjectTarget) {
      const evaluationProject = await this.findEvaluationProjectById(targetId)
      return evaluationProject
    } else {
      const modelProcess = await this.findModelProcessById(targetId)
      return modelProcess
    }
  }

  private async findModelProcessById(modelProcessId: string): Promise<ModelProcess> {
    const modelProcess = await this.modelProcessRepository
      .createQueryBuilder('modelProcess')
      .where('modelProcess.id = :modelProcessId')
      .setParameters({ modelProcessId })
      .getOne()

    if (!modelProcess) {
      throw new ModelProcessNotFoundError()
    }

    return modelProcess
  }

  private async findEvaluationProjectById(evaluationProjectId: string): Promise<EvaluationProject> {
    const evaluationProject = await this.evaluationProjectRepository
      .createQueryBuilder('evaluationProject')
      .where('evaluationProject.id = :evaluationProjectId')
      .setParameters({ evaluationProjectId })
      .getOne()

    if (!evaluationProject) {
      throw new EvaluationProjectNotFoundError()
    }

    return evaluationProject
  }

  private async getEvaluationState(indicator: Indicator): Promise<EvaluationStateEnum> {
    const whereExists = Boolean(indicator.expectedResultIndicator)
      ? `
    exists (
      select
        1
      from
        evaluation.evaluation_indicators evaluationIndicators
      join
        evaluation.expected_result_indicator expectedResultIndicator
        on expectedResultIndicator."evaluationIndicatorsId" = evaluationIndicators.id
      join
        evaluation.indicator indicator
        on indicator."expectedResultIndicatorId" = expectedResultIndicator.id
      where
        evaluationIndicators."evaluationId" = evaluation.id
        and indicator.id = :indicatorId::uuid
    )
  `
      : `
        exists (
          select
            1
          from
            evaluation.model_capacity_indicator modelCapacityIndicator
          join
            evaluation.indicator indicator
            on indicator."modelCapacityIndicatorId" = modelCapacityIndicator.id
          where
            modelCapacityIndicator."evaluationId" = evaluation.id
            and indicator.id = :indicatorId::uuid
        )
      `
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where(whereExists)
      .setParameters({ indicatorId: indicator.id })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }

    return evaluation.state
  }

  private async uploadFile(uploadIndicatorFileDto: UploadIndicatorFileDto): Promise<string> {
    const uploadFileDto = this.buildUploadFileDto(uploadIndicatorFileDto)
    try {
      const url = await this.fileManagerAdapterService.upload(uploadFileDto)
      return url
    } catch {
      return 'www.naoAguentoMaisAAmazon.com'
    }
  }

  private buildUploadFileDto(uploadIndicatorFileDto: UploadIndicatorFileDto): UploadFileDto {
    const folder = `indicators/${uploadIndicatorFileDto.indicatorId}/evidences`
    const uploadFileDto = new UploadFileDto()

    uploadFileDto.buffer = uploadIndicatorFileDto.buffer
    uploadFileDto.mimetype = uploadIndicatorFileDto.mimetype
    uploadFileDto.folder = folder

    return uploadFileDto
  }

  private buildEvidenceSource(
    indicator: Indicator,
    url: string,
    uploadIndicatorFileDto: UploadIndicatorFileDto,
    target: EvaluationProject | ModelProcess,
    evaluationState: EvaluationStateEnum
  ): EvidenceSource {
    const evidenceSource = new EvidenceSource()

    evidenceSource.indicator = indicator
    evidenceSource.createdOn = evaluationState
    evidenceSource.files = [this.buildEvidenceSourceFile(uploadIndicatorFileDto, url)]

    if (target instanceof EvaluationProject) {
      evidenceSource.evaluationProject = target
    }

    if (target instanceof ModelProcess) {
      evidenceSource.modelProcess = target
    }

    return evidenceSource
  }

  private buildEvidenceSourceFile(uploadIndicatorFileDto: UploadIndicatorFileDto, url: string): EvidenceSourceFile {
    const evidenceSourceFile = new EvidenceSourceFile()

    evidenceSourceFile.mimetype = uploadIndicatorFileDto.mimetype
    evidenceSourceFile.name = uploadIndicatorFileDto.originalname
    evidenceSourceFile.source = url

    return evidenceSourceFile
  }
}
