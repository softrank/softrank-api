import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateEvaluationServiceBodyDto, CreateEvaluationServiceDto } from '../dtos'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { CreateEvaluationService } from '../services/create-evaluation.service'
import { FindEvaluationIndicatorsService } from '../services/find-evaluation-indicators.service'
import { EvaluationIndicatorsDto } from '../dtos/evaluation-indicators'

@Controller('evaluation')
@ApiTags('Evaluation')
export class EvaluationController {
  constructor(
    private readonly createEvaluationService: CreateEvaluationService,
    private readonly findEvaluationIndicatorsService: FindEvaluationIndicatorsService
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
}
