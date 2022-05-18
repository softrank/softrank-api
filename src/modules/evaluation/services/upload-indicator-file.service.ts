import { EvaluationIndicatorsFileDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { FileManagerAdapterService } from '@modules/file-manager/services'
import { Indicator, IndicatorFile, EvaluationProject } from '@modules/evaluation/entities'
import { IndicatorNotFoundError } from '@modules/evaluation/errors'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { UploadFileDto } from '@modules/file-manager/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class UploadIndicatorFileService {
  constructor(
    @InjectRepository(IndicatorFile)
    private readonly indicatorFileRepository: Repository<IndicatorFile>,
    @InjectRepository(Indicator)
    private readonly indicatorRepository: Repository<Indicator>,
    @InjectRepository(EvaluationProject)
    private readonly evaluationProjectRepository: Repository<EvaluationProject>,
    private readonly fileManagerAdapterService: FileManagerAdapterService
  ) {}

  public async upload(uploadIndicatorFileDto: UploadIndicatorFileDto): Promise<EvaluationIndicatorsFileDto> {
    const indicator = await this.findIndicatorById(uploadIndicatorFileDto.indicatorId)
    const evaluationProject = await this.findEvaluationProjectById(uploadIndicatorFileDto.projectId)
    const url = await this.uploadFile(uploadIndicatorFileDto)
    const indicatorFile = this.buildIndicatorFile(indicator, url, uploadIndicatorFileDto, evaluationProject)
    const savedIndicatorFile = await this.indicatorFileRepository.save(indicatorFile)
    const evaluationIndicatorsFileDto = this.buildEvaluationIndicatorsFileDto(savedIndicatorFile)

    return evaluationIndicatorsFileDto
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
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

  private async uploadFile(uploadIndicatorFileDto: UploadIndicatorFileDto): Promise<string> {
    const uploadFileDto = this.buildUploadFileDto(uploadIndicatorFileDto)
    const url = await this.fileManagerAdapterService.upload(uploadFileDto)

    return url
  }

  private buildUploadFileDto(uploadIndicatorFileDto: UploadIndicatorFileDto): UploadFileDto {
    const uploadFileDto = new UploadFileDto()

    uploadFileDto.buffer = uploadIndicatorFileDto.buffer
    uploadFileDto.mimetype = uploadIndicatorFileDto.mimetype

    return uploadFileDto
  }

  private buildIndicatorFile(
    indicator: Indicator,
    url: string,
    uploadIndicatorFileDto: UploadIndicatorFileDto,
    evaluationProject: EvaluationProject
  ): IndicatorFile {
    const indicatorFile = new IndicatorFile()

    indicatorFile.indicator = indicator
    indicatorFile.source = url
    indicatorFile.name = uploadIndicatorFileDto.originalname
    indicatorFile.mimetype = uploadIndicatorFileDto.mimetype
    indicatorFile.evaluationProject = evaluationProject

    return indicatorFile
  }

  private buildEvaluationIndicatorsFileDto(indicatorFile: IndicatorFile): EvaluationIndicatorsFileDto {
    const evaluationIndicatorsFileDto = new EvaluationIndicatorsFileDto()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source
    evaluationIndicatorsFileDto.mimetype = indicatorFile.mimetype

    return evaluationIndicatorsFileDto
  }
}
