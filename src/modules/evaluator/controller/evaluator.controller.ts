import {
  CreateEvaluatorDcoumentation,
  GetEvaluatorsDocumentation,
  GetEvaluatorDocumentation,
  UpdateEvaluatorDocumentation,
  ListEvaluatorEvaluationsDocumentation
} from '@modules/evaluator/swagger'
import {
  CreateEvaluatorService,
  FindEvaluatorsService,
  FindEvaluatorByIdService,
  UpdateEvaluatorService
} from '@modules/evaluator/services'
import { CreateEvaluatorDto, FindEvaluatorQueryDto, UpdateEvaluatorBodyDto, UpdateEvaluatorDto } from '@modules/evaluator/dtos'
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { AuthorizedUser } from '@modules/shared/decorators'
import { ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { RouteGuards } from '../../shared/decorators/route-guards.decorator'
import { ListEvaluationsService } from '@modules/evaluation/services'
import { ListEvaluationResponseDto, ListEvaluationsQueryDto } from '@modules/evaluation/dtos'
import { ModelDto } from '@modules/shared/dtos/model'
import { ListEvaluatorModelsService } from '../services/model'

@Controller('evaluators')
@ApiTags('Evaluator')
export class EvaluatorController {
  constructor(
    private readonly createEvaluatorService: CreateEvaluatorService,
    private readonly getEvaluatorsService: FindEvaluatorsService,
    private readonly findEvaluatorByIdService: FindEvaluatorByIdService,
    private readonly updateEvaluatorService: UpdateEvaluatorService,
    private readonly listEvaluationsService: ListEvaluationsService,
    private readonly listEvaluatorModelsService: ListEvaluatorModelsService
  ) {}

  @Post()
  @CreateEvaluatorDcoumentation()
  public createEvaluator(@Body() createEvaluatorDto: CreateEvaluatorDto): Promise<EvaluatorDto> {
    return this.createEvaluatorService.create(createEvaluatorDto)
  }

  @Get()
  @GetEvaluatorsDocumentation()
  public getEvaluators(@Query() query: FindEvaluatorQueryDto): Promise<EvaluatorDto[]> {
    return this.getEvaluatorsService.find(query)
  }

  @Get('me')
  @RouteGuards()
  public evaluatorMe(@AuthorizedUser() user: AuthorizedUserDto): Promise<EvaluatorDto> {
    return this.findEvaluatorByIdService.find(user.id)
  }

  @Get('evaluations')
  @RouteGuards()
  @ListEvaluatorEvaluationsDocumentation()
  public listEvaluatorEvaluations(
    @Query() query: ListEvaluationsQueryDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<ListEvaluationResponseDto[]> {
    const listEvaluationsQueryDto = new ListEvaluationsQueryDto({
      evaluatorId: user.id,
      search: query.search,
      limit: query.limit,
      page: query.page
    })

    return this.listEvaluationsService.list(listEvaluationsQueryDto)
  }

  @Get('models')
  @RouteGuards()
  public listEvaluatorModelLevels(@AuthorizedUser() user: AuthorizedUserDto): Promise<ModelDto[]> {
    return this.listEvaluatorModelsService.list(user.id)
  }

  @Get(':id')
  @GetEvaluatorDocumentation()
  public getEvaluator(@Param('id', uuidParamValidation()) evaluatorId: string): Promise<EvaluatorDto> {
    return this.findEvaluatorByIdService.find(evaluatorId)
  }

  @Put(':id')
  @RouteGuards()
  @UpdateEvaluatorDocumentation()
  public updateEvaluator(
    @Param('id', uuidParamValidation()) evaluatorId: string,
    @Body() updateEvaluatorBodyDto: UpdateEvaluatorBodyDto
  ): Promise<EvaluatorDto> {
    const updateEvaluadotorDto = new UpdateEvaluatorDto(evaluatorId, updateEvaluatorBodyDto)
    return this.updateEvaluatorService.update(updateEvaluadotorDto)
  }
}
