import { Indicator, EvaluationProject, EvidenceSource, EvidenceSourceFile, Evaluation } from '@modules/evaluation/entities'
import { IndicatorNotFoundError, EvaluationNotFoundError } from '@modules/evaluation/errors'
import { FileManagerAdapterService } from '@modules/file-manager/services'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { UploadFileDto } from '@modules/file-manager/dtos'
import { EvidenceSourceDto } from '../dtos/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { EvaluationStateEnum } from '../enums'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UploadEvidenceSourceService {
  constructor(
    @InjectRepository(Indicator)
    private readonly indicatorRepository: Repository<Indicator>,
    @InjectRepository(EvaluationProject)
    private readonly evaluationProjectRepository: Repository<EvaluationProject>,
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
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
    const evaluationProject = await this.findEvaluationProjectById(uploadIndicatorFileDto.projectId)
    const url = await this.uploadFile(uploadIndicatorFileDto)
    const evaluationState = await this.getEvaluationState(indicator.expectedResultIndicator.id)
    const evidenceSourceToCreate = this.buildEvidenceSource(indicator, url, uploadIndicatorFileDto, evaluationProject, evaluationState)
    const evidenceSource = await manager.save(evidenceSourceToCreate)

    return evidenceSource
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
      .innerJoinAndSelect('indicator.expectedResultIndicator', 'expectedResultIndicator')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError()
    }

    return indicator
  }

  private async findEvaluationProjectById(evaluationProjectId: string): Promise<EvaluationProject> {
    const evaluationProject = await this.evaluationProjectRepository
      .createQueryBuilder('evaluationProject')
      .where('evaluationProject.id = :evaluationProjectId')
      .setParameters({ evaluationProjectId })
      .getOne()

    if (!evaluationProject) {
      throw new Error()
    }

    return evaluationProject
  }

  private async getEvaluationState(expectedResultIndicatorId: string): Promise<EvaluationStateEnum> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where(
        `
        exists (
          select
            1
          from
            evaluation.evaluation_indicators evaluationIndicators
          join
            evaluation.expected_result_indicator expectedResultIndicator
            on expectedResultIndicator."evaluationIndicatorsId" = evaluationIndicators.id
          where
            evaluationIndicators."evaluationId" = evaluation.id
            and expectedResultIndicator.id = :expectedResultIndicatorId::uuid
        )
      `
      )
      .setParameters({ expectedResultIndicatorId })
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
    evaluationProject: EvaluationProject,
    evaluationState: EvaluationStateEnum
  ): EvidenceSource {
    const evidenceSource = new EvidenceSource()

    evidenceSource.indicator = indicator
    evidenceSource.createdOn = evaluationState
    evidenceSource.evidenceSourceFiles = [this.buildEvidenceSourceFile(uploadIndicatorFileDto, url)]
    evidenceSource.evaluationProject = evaluationProject

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
