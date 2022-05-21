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
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { EvaluationDto } from '@modules/shared/dtos/evaluation'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'

@Controller('evaluation')
@ApiTags('Evaluation')
export class EvaluationController {
  constructor(
    private readonly createEvaluationService: CreateEvaluationService,
    private readonly findEvaluationIndicatorsService: FindEvaluationIndicatorsService,
    private readonly listEvaluationProcessesService: ListEvaluationProcessesService,
    private readonly findEvaluationService: FindEvaluationService,
    private readonly listEvaluationsService: ListEvaluationsService
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

  @Get(':id')
  @RouteGuards()
  public findEvaluationByID(@Param('id', uuidParamValidation()) evaluationId: string): Promise<EvaluationDto> {
    return this.findEvaluationService.findById(evaluationId)
  }
}
