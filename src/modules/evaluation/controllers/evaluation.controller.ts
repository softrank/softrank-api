import {
  CreateEvaluationServiceBodyDto,
  CreateEvaluationServiceDto,
  ListEvaluationProcessesQueryDto,
  ListEvaluationResponseDto,
  ListEvaluationsQueryDto
} from '@modules/evaluation/dtos'
import {
  FindEvaluationIndicatorsService,
  ListEvaluationsService,
  FindEvaluationService,
  ListEvaluationProcessesService,
  CreateEvaluationService
} from '@modules/evaluation/services'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { EvaluationIndicatorsDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { AuthorizedUser, RouteGuards, SwaggerUploadFileDecorator } from '@modules/shared/decorators'
import { EvaluationDto } from '@modules/shared/dtos/evaluation'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'
import { ListEvaluationAdjustments } from '../services/adjustment'
import { AdjustmentDto, InterviewDto } from '../dtos/entities'
import { UploadEvaluationPlanService, UploadInterviewService } from '../services/evaluation'
import { buildImageFileInterceptor } from '@modules/file-manager/decorators'
import { UploadInterviewDto } from '../dtos/interview'
import { UploadEvaluationPlanDto } from '../dtos/evaluation-plan'

@Controller('evaluation')
@ApiTags('Evaluation')
export class EvaluationController {
  constructor(
    private readonly createEvaluationService: CreateEvaluationService,
    private readonly findEvaluationIndicatorsService: FindEvaluationIndicatorsService,
    private readonly listEvaluationProcessesService: ListEvaluationProcessesService,
    private readonly findEvaluationService: FindEvaluationService,
    private readonly listEvaluationsService: ListEvaluationsService,
    private readonly listEvaluationAdjustments: ListEvaluationAdjustments,
    private readonly uploadInterviewService: UploadInterviewService,
    private readonly uploadEvaluationPlanService: UploadEvaluationPlanService
  ) {}

  @Post()
  @RouteGuards()
  public createEvaluation(
    @Body() createEvaluationServiceBodyDto: CreateEvaluationServiceBodyDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<any> {
    const createEvaluationServiceDto = new CreateEvaluationServiceDto(user.id, createEvaluationServiceBodyDto)
    return this.createEvaluationService.create(createEvaluationServiceDto)
  }

  @Post(':evaluationId/interviews')
  @RouteGuards()
  @UseInterceptors(buildImageFileInterceptor('file'))
  @SwaggerUploadFileDecorator()
  public uploadInterview(
    @UploadedFile() expressFile: Express.Multer.File,
    @Param('evaluationId', uuidParamValidation()) evaluationId: string
  ): Promise<InterviewDto> {
    const uploadInterviewDto = new UploadInterviewDto(expressFile, evaluationId)
    return this.uploadInterviewService.upload(uploadInterviewDto)
  }

  @Post(':evaluationId/plans')
  @RouteGuards()
  @UseInterceptors(buildImageFileInterceptor('file'))
  @SwaggerUploadFileDecorator()
  public uploadEvaluationPlan(
    @UploadedFile() expressFile: Express.Multer.File,
    @Param('evaluationId', uuidParamValidation()) evaluationId: string
  ): Promise<InterviewDto> {
    const uploadEvaluationPlanDto = new UploadEvaluationPlanDto(expressFile, evaluationId)
    return this.uploadEvaluationPlanService.upload(uploadEvaluationPlanDto)
  }

  @Get()
  @RouteGuards()
  public listEvaluations(
    @AuthorizedUser() user: AuthorizedUserDto,
    @Query() query: ListEvaluationsQueryDto
  ): Promise<ListEvaluationResponseDto[]> {
    const listEvaluationsQueryDto = new ListEvaluationsQueryDto({ ...query, userId: user.id })
    return this.listEvaluationsService.list(listEvaluationsQueryDto)
  }
  @Get(':id/indicators')
  @RouteGuards()
  public findEvaluationIndicators(@Param('id') evaluationId: string): Promise<EvaluationIndicatorsDto> {
    return this.findEvaluationIndicatorsService.find(evaluationId)
  }

  @Get(':id/processes')
  @RouteGuards()
  public findEvaluationProcesses(
    @Param('id', uuidParamValidation()) evaluationId: string,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<any> {
    const listEvaluationProcessesQueryDto = new ListEvaluationProcessesQueryDto(evaluationId, user.id)
    return this.listEvaluationProcessesService.list(listEvaluationProcessesQueryDto)
  }

  @Get(':id/adjustments')
  @RouteGuards()
  public listEvaluationAdjustmentsRoute(@Param('id', uuidParamValidation()) evaluatoinId: string): Promise<AdjustmentDto[]> {
    return this.listEvaluationAdjustments.list(evaluatoinId)
  }

  @Get(':id')
  @RouteGuards()
  public findEvaluationByID(@Param('id', uuidParamValidation()) evaluationId: string): Promise<EvaluationDto> {
    return this.findEvaluationService.findById(evaluationId)
  }
}
