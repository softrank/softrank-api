import {
  CreateEvaluatorDcoumentation,
  GetEvaluatorsDocumentation,
  GetEvaluatorDocumentation,
  UpdateEvaluatorDocumentation
} from '@modules/evaluator/swagger'
import {
  CreateEvaluatorService,
  FindEvaluatorsService,
  FindEvaluatorByIdService,
  UpdateEvaluatorService
} from '@modules/evaluator/services'
import {
  CreateEvaluatorDto,
  FindEvaluatorQueryDto,
  UpdateEvaluatorBodyDto,
  UpdateEvaluatorDto
} from '@modules/evaluator/dtos'
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { AuthorizedUser } from '@modules/shared/decorators'
import { ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { RouteGuards } from '../../shared/decorators/route-guards.decorator'

@Controller('evaluators')
@ApiTags('Evaluator')
@RouteGuards()
export class EvaluatorController {
  constructor(
    private readonly createEvaluatorService: CreateEvaluatorService,
    private readonly getEvaluatorsService: FindEvaluatorsService,
    private readonly findEvaluatorByIdService: FindEvaluatorByIdService,
    private readonly updateEvaluatorService: UpdateEvaluatorService
  ) {}

  @Post()
  @CreateEvaluatorDcoumentation()
  public createEvaluator(
    @Body() createEvaluatorDto: CreateEvaluatorDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvaluatorDto> {
    return this.createEvaluatorService.create(createEvaluatorDto, user.id)
  }

  @Get()
  @GetEvaluatorsDocumentation()
  public getEvaluators(@Query() query: FindEvaluatorQueryDto): Promise<EvaluatorDto[]> {
    return this.getEvaluatorsService.find(query)
  }

  @Get('me')
  public evaluatorMe(@AuthorizedUser() user: AuthorizedUserDto): Promise<EvaluatorDto> {
    return this.findEvaluatorByIdService.find(user.id)
  }

  @Get(':id')
  @GetEvaluatorDocumentation()
  public getEvaluator(@Param('id', uuidParamValidation()) evaluatorId: string): Promise<EvaluatorDto> {
    return this.findEvaluatorByIdService.find(evaluatorId)
  }

  @Put(':id')
  @UpdateEvaluatorDocumentation()
  public updateEvaluator(
    @Param('id', uuidParamValidation()) evaluatorId: string,
    @Body() updateEvaluatorBodyDto: UpdateEvaluatorBodyDto
  ): Promise<EvaluatorDto> {
    const updateEvaluadotorDto = new UpdateEvaluatorDto(evaluatorId, updateEvaluatorBodyDto)
    return this.updateEvaluatorService.update(updateEvaluadotorDto)
  }
}
