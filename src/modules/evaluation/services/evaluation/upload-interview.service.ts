import { InterviewDto } from '@modules/evaluation/dtos/entities'
import { UploadInterviewDto } from '@modules/evaluation/dtos/interview'
import { Evaluation, Interview } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { UploadFileDto } from '@modules/file-manager/dtos'
import { FileManagerAdapterService } from '@modules/file-manager/services'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class UploadInterviewService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly fileManagerAdapterService: FileManagerAdapterService
  ) {}

  public async upload(uploadInterviewDto: UploadInterviewDto): Promise<InterviewDto> {
    const interview = await getConnection().transaction((manager) => {
      return this.uploadWithTransaction(uploadInterviewDto, manager)
    })

    const interviewDto = InterviewDto.fromEntity(interview)
    return interviewDto
  }

  public async uploadWithTransaction(uploadInterviewDto: UploadInterviewDto, manager: EntityManager): Promise<Interview> {
    const evaluation = await this.findEvaluationById(uploadInterviewDto.evaluationId)
    const bucketUrl = await this.uploadToBucket(uploadInterviewDto)
    const interview = this.buildInterviewEntity(uploadInterviewDto, bucketUrl, evaluation)
    const insertedInterview = await manager.save(interview)

    return insertedInterview
  }

  private async findEvaluationById(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError()
    }

    return evaluation
  }

  private async uploadToBucket(uploadInterviewDto: UploadInterviewDto): Promise<string> {
    const uploadFileDto = this.buildUploadFileDto(uploadInterviewDto)
    const bucketUrl = await this.fileManagerAdapterService.upload(uploadFileDto)

    return bucketUrl
  }

  private buildUploadFileDto(uploadInterviewDto: UploadInterviewDto): UploadFileDto {
    const folder = `evaluations/${uploadInterviewDto.evaluationId}/interviews`
    const uploadFileDto = new UploadFileDto()

    uploadFileDto.buffer = uploadInterviewDto.buffer
    uploadFileDto.folder = folder
    uploadFileDto.mimetype = uploadInterviewDto.mimetype

    return uploadFileDto
  }

  private buildInterviewEntity(uploadInterviewDto: UploadInterviewDto, bucketUrl: string, evaluation: Evaluation): Interview {
    const interview = new Interview()

    interview.mimetype = uploadInterviewDto.mimetype
    interview.name = uploadInterviewDto.originalname
    interview.source = bucketUrl
    interview.evaluation = evaluation

    return interview
  }
}
