import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateEvaluationServiceBodyDto, CreateEvaluationServiceDto, ListEvaluationProcessesQueryDto } from '../dtos'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { CreateEvaluationService } from '../services/create-evaluation.service'
import { FindEvaluationIndicatorsService } from '../services/find-evaluation-indicators.service'
import { EvaluationIndicatorsDto } from '../dtos/evaluation-indicators'
import { FindEvaluationService, ListEvaluationProcessesService } from '../services'
import { uuidParamValidation } from '@utils/validations'
import { EvaluationDto } from '@modules/shared/dtos/evaluation'

@Controller('evaluation')
@ApiTags('Evaluation')
export class EvaluationController {
  constructor(
    private readonly createEvaluationService: CreateEvaluationService,
    private readonly findEvaluationIndicatorsService: FindEvaluationIndicatorsService,
    private readonly listEvaluationProcessesService: ListEvaluationProcessesService,
    private readonly findEvaluationService: FindEvaluationService
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
