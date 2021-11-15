import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateEvaluationServiceBodyDto, CreateEvaluationServiceDto } from '../dtos'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { CreateEvaluationService } from '../services/create-evaluation.service'

@Controller('evaluation')
@ApiTags('Evaluation')
export class EvaluationController {
  constructor(private readonly createEvaluationService: CreateEvaluationService) {}
  @Post()
  @RouteGuards()
  public createEvaluation(
    @Body() createEvaluationServiceBodyDto: CreateEvaluationServiceBodyDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<any> {
    const createEvaluationServiceDto = new CreateEvaluationServiceDto(user.id, createEvaluationServiceBodyDto)
    return this.createEvaluationService.create(createEvaluationServiceDto)
  }
}
