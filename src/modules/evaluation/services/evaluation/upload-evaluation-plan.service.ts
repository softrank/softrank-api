import { UploadEvaluationPlanDto } from '@modules/evaluation/dtos/evaluation-plan'
import { FileManagerAdapterService } from '@modules/file-manager/services'
import { Evaluation, EvaluationPlan } from '@modules/evaluation/entities'
import { EvaluationPlanDto } from '@modules/evaluation/dtos/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { UploadFileDto } from '@modules/file-manager/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UploadEvaluationPlanService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly fileManagerAdapterService: FileManagerAdapterService
  ) {}

  public async upload(uploadEvaluationPlanDto: UploadEvaluationPlanDto): Promise<EvaluationPlanDto> {
    const evaluationPlan = await getConnection().transaction((manager) => {
      return this.uploadWithTransaction(uploadEvaluationPlanDto, manager)
    })

    const evaluationPlanDto = EvaluationPlanDto.fromEntity(evaluationPlan)
    return evaluationPlanDto
  }

  public async uploadWithTransaction(uploadEvaluationPlanDto: UploadEvaluationPlanDto, manager: EntityManager): Promise<EvaluationPlan> {
    const evaluation = await this.findEvaluationById(uploadEvaluationPlanDto.evaluationId)
    const bucketUrl = await this.uploadToBucket(uploadEvaluationPlanDto)
    const evaluationPlan = this.buildEvaluationPlanEntity(uploadEvaluationPlanDto, bucketUrl, evaluation)
    const insertedEvaluationPlan = await manager.save(evaluationPlan)

    return insertedEvaluationPlan
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

  private async uploadToBucket(uploadEvaluationPlanDto: UploadEvaluationPlanDto): Promise<string> {
    const uploadFileDto = this.buildUploadFileDto(uploadEvaluationPlanDto)
    const bucketUrl = await this.fileManagerAdapterService.upload(uploadFileDto)

    return bucketUrl
  }

  private buildUploadFileDto(uploadEvaluationPlanDto: UploadEvaluationPlanDto): UploadFileDto {
    const folder = `evaluations/${uploadEvaluationPlanDto.evaluationId}/plans`
    const uploadFileDto = new UploadFileDto()

    uploadFileDto.buffer = uploadEvaluationPlanDto.buffer
    uploadFileDto.folder = folder
    uploadFileDto.mimetype = uploadEvaluationPlanDto.mimetype

    return uploadFileDto
  }

  private buildEvaluationPlanEntity(
    uploadEvaluationPlanDto: UploadEvaluationPlanDto,
    bucketUrl: string,
    evaluation: Evaluation
  ): EvaluationPlan {
    const evaluationPlan = new EvaluationPlan()

    evaluationPlan.mimetype = uploadEvaluationPlanDto.mimetype
    evaluationPlan.name = uploadEvaluationPlanDto.originalname
    evaluationPlan.source = bucketUrl
    evaluationPlan.evaluation = evaluation

    return evaluationPlan
  }
}
