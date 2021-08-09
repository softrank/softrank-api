import { CreateEvaluatorDocumentation } from '@modules/entity/swagger'
import { GetEvaluatorService } from '@modules/entity/services'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { EvaluatorDto } from '@modules/entity/dtos'
import { CustomGuard } from '@modules/user/guards'
import { GetUser } from '@shared/decorators'
import { LoggedUser } from '@shared/types'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Evaluator')
@Controller('evaluators')
@ApiBearerAuth()
@UseGuards(CustomGuard)
export class ProctedEvaluatorController {
  constructor(private readonly getEvaluatorService: GetEvaluatorService) {}

  @Get('me')
  @CreateEvaluatorDocumentation()
  async me(@GetUser() user: LoggedUser): Promise<EvaluatorDto> {
    return this.getEvaluatorService.me(user.id)
  }
}
