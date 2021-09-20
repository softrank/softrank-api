import {
  CreateEvaluatorDcoumentation,
  GetEvaluatorsDocumentation,
  GetEvaluatorDocumentation,
  UpdateEvaluatorDocumentation
} from '@modules/evaluator/swagger'
import {
  CreateEvaluatorService,
  GetEvaluatorsService,
  GetEvaluatorService,
  UpdateEvaluatorService
} from '@modules/evaluator/services'
import { CreateEvaluatorDto, UpdateEvaluatorBodyDto, UpdateEvaluatorDto } from '@modules/evaluator/dtos'
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { AuthorizationGuard } from '@modules/public/guards'
import { AuthorizedUser } from '@modules/shared/decorators'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'

@Controller('evaluators')
@ApiTags('Evaluator')
@UseGuards(AuthorizationGuard)
@ApiBearerAuth()
export class EvaluatorController {
  constructor(
    private readonly createEvaluatorService: CreateEvaluatorService,
    private readonly getEvaluatorsService: GetEvaluatorsService,
    private readonly getEvaluatorService: GetEvaluatorService,
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
  public getEvaluators(): Promise<EvaluatorDto[]> {
    return this.getEvaluatorsService.getEvaluators()
  }

  @Get(':id')
  @GetEvaluatorDocumentation()
  public getEvaluator(@Param('id', uuidParamValidation()) evaluatorId: string): Promise<EvaluatorDto> {
    return this.getEvaluatorService.getEvaluator(evaluatorId)
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
