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
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { AuthorizedUser, RouteGuards, SwaggerUploadFileDecorator } from '@modules/shared/decorators'
import { EvaluationDto } from '@modules/shared/dtos/evaluation'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'
import { ListEvaluationAdjustments } from '../services/adjustment'
import { AdjustmentDto, InterviewDto, ModelCapacityIndicatorDto } from '../dtos/entities'
import {
  DeleteEvaluationPlanService,
  DeleteInterviewService,
  EvaluationHasAModelCapacityTypeService,
  EvaluationNextStepService,
  ListModelProcessToOrganizationalModelCapacitiesIndicator,
  UploadEvaluationPlanService,
  UploadInterviewService
} from '../services/evaluation'
import { buildImageFileInterceptor } from '@modules/file-manager/decorators'
import { UploadInterviewDto } from '../dtos/interview'
import { UploadEvaluationPlanDto } from '../dtos/evaluation-plan'
import {
  GenerateEvaluationModelCapacityIndicatorsService,
  ListEvaluationModelCapacityIndicatorsService
} from '../services/model-capacity-indicators'
import { ListEvaluationModelCapacitiesIndicatorsQueryDto } from '../dtos/model-capacity-indicator'
import { VerifyIfEvaluationHasModelCapacityTypeDto } from '../dtos/evaluation/verify-if-evaluation-has-model-capacity-type-query.dto'
import { ModelProcessDto } from '@modules/shared/dtos/model'

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
    private readonly uploadEvaluationPlanService: UploadEvaluationPlanService,
    private readonly evaluationNextStepService: EvaluationNextStepService,
    private readonly deleteEvaluationPlanService: DeleteEvaluationPlanService,
    private readonly deleteInterviewService: DeleteInterviewService,
    private readonly generateEvaluationModelCapacityIndicatorsService: GenerateEvaluationModelCapacityIndicatorsService,
    private readonly listEvaluationModelCapacityIndicatorsService: ListEvaluationModelCapacityIndicatorsService,
    private readonly evaluationHasAModelCapacityTypeService: EvaluationHasAModelCapacityTypeService,
    private readonly listModelProcessToOrganizationalModelCapacitiesIndicator: ListModelProcessToOrganizationalModelCapacitiesIndicator
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

  @Post(':evaluationId/fix-capacities')
  @RouteGuards()
  public fixEvaluationCapacities(@Param('evaluationId', uuidParamValidation()) evaluationId: string): Promise<void> {
    return this.generateEvaluationModelCapacityIndicatorsService.generate(evaluationId)
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

  @Delete('plans/:planId')
  @RouteGuards()
  public deleteEvaluationPlan(@Param('planId', uuidParamValidation()) evaluationPlanId: string): Promise<void> {
    return this.deleteEvaluationPlanService.delete(evaluationPlanId)
  }

  @Delete('interviews/:interviewId')
  @RouteGuards()
  public deleteInterview(@Param('interviewId', uuidParamValidation()) interviewId: string): Promise<void> {
    return this.deleteInterviewService.delete(interviewId)
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

  @Get(':id/capacities')
  @RouteGuards()
  public listEvaluationModelCapacitiesIndicators(
    @Param('id', uuidParamValidation()) evaluatoinId: string,
    @Query() query: ListEvaluationModelCapacitiesIndicatorsQueryDto
  ): Promise<ModelCapacityIndicatorDto[]> {
    return this.listEvaluationModelCapacityIndicatorsService.list(evaluatoinId, query.type)
  }

  @Get(':id/organizational-proesses')
  public listEvaluationOrganizationalModelProcesses(@Param('id', uuidParamValidation()) evaluationId: string): Promise<ModelProcessDto[]> {
    return this.listModelProcessToOrganizationalModelCapacitiesIndicator.list(evaluationId)
  }

  @Get(':id')
  @RouteGuards()
  public findEvaluationByID(@Param('id', uuidParamValidation()) evaluationId: string): Promise<EvaluationDto> {
    return this.findEvaluationService.findById(evaluationId)
  }

  @Get(':id/has-type')
  @RouteGuards()
  public verifyIfEvaluationHasModelCapacityType(
    @Param('id', uuidParamValidation()) evaluationId: string,
    @Query() verifyIfEvaluationHasModelCapacityTypeDto: VerifyIfEvaluationHasModelCapacityTypeDto
  ): Promise<boolean> {
    return this.evaluationHasAModelCapacityTypeService.verify(evaluationId, verifyIfEvaluationHasModelCapacityTypeDto.type)
  }

  @Put(':id/next-step')
  @RouteGuards()
  public evaluationNextStep(@Param('id', uuidParamValidation()) evaluationId: string): Promise<EvaluationDto> {
    return this.evaluationNextStepService.next(evaluationId)
  }
}
