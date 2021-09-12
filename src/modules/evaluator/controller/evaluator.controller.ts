import { CreateEvaluatorDcoumentation } from '@modules/evaluator/swagger'
import { CreateEvaluatorService } from '@modules/evaluator/services'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { CreateEvaluatorDto } from '@modules/evaluator/dtos'
import { AuthorizationGuard } from '@modules/public/guards'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthorizedUser } from '../../shared/decorators/authorized-user.decorator'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'

@Controller('evaluators')
@ApiTags('Evaluator')
@UseGuards(AuthorizationGuard)
@ApiBearerAuth()
export class EvaluatorController {
  constructor(private readonly createEvaluatorService: CreateEvaluatorService) {}

  @Post()
  @CreateEvaluatorDcoumentation()
  public async createEvaluator(
    @Body() createEvaluatorDto: CreateEvaluatorDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvaluatorDto> {
    return this.createEvaluatorService.create(createEvaluatorDto, user.id)
  }

  @Get()
  public test(@AuthorizedUser() user: any): void {
    console.log(user)
  }
}
