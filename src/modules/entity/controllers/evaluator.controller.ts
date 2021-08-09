import { CreateEvaluatorDto, EvaluatorDto } from '@modules/entity/dtos'
import { CreateEvaluatorService } from '@modules/entity/services'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Evaluator')
@Controller('evaluators')
export class EvaluatorController {
  constructor(
    private readonly createEvaluatorService: CreateEvaluatorService
  ) {}

  @Post()
  async createModel(
    @Body() createEvaluatorDto: CreateEvaluatorDto
  ): Promise<EvaluatorDto> {
    return this.createEvaluatorService.create(createEvaluatorDto)
  }
}
