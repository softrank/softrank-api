import { CreateEvaluatorDto, EvaluatorDto } from '@modules/entity/dtos'
import { CreateEvaluatorDocumentation } from '@modules/entity/swagger'
import { CreateEvaluatorService } from '@modules/entity/services'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Evaluator')
@Controller('evaluators')
export class UnproctedEvaluatorController {
  constructor(
    private readonly createEvaluatorService: CreateEvaluatorService
  ) {}

  @Post()
  @CreateEvaluatorDocumentation()
  async createModel(
    @Body() createEvaluatorDto: CreateEvaluatorDto
  ): Promise<EvaluatorDto> {
    return this.createEvaluatorService.create(createEvaluatorDto)
  }
}
