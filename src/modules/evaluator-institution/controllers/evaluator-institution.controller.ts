import { CreateEvaluatorInstitutionDocumentation } from '@modules/evaluator-institution/swagger'
import {
  CreateEvaluatorInstitutionService,
  FindEvaluatorInstitution,
  ListEvaluatorInstitutionsService,
  EvaluatorInstitutionMeService
} from '@modules/evaluator-institution/services'
import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { CreateEvaluatorInstitutionDto } from '@modules/evaluator-institution/dtos'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { AuthorizedUser } from '@modules/shared/decorators'
import { uuidParamValidation } from '../../../utils/validations/uuid-param.validation'
import { RouteGuards } from '../../shared/decorators/route-guards.decorator'

@Controller('evaluator-institutions')
@RouteGuards()
export class EvaluatorInstitutionController {
  constructor(
    private readonly createEvaluatorInstitutionService: CreateEvaluatorInstitutionService,
    private readonly findEvaluatorInstitutionService: FindEvaluatorInstitution,
    private readonly listEvaluatorInstitutionsService: ListEvaluatorInstitutionsService,
    private readonly evaluatorInstitutionMeService: EvaluatorInstitutionMeService
  ) {}

  @Post()
  @CreateEvaluatorInstitutionDocumentation()
  public createEvaluatorInstitution(
    @Body() createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvaluatorInstitutionDto> {
    return this.createEvaluatorInstitutionService.create(createEvaluatorInstitutionDto, user.id)
  }

  @Get()
  public listEvaluatorInstitution(): Promise<EvaluatorInstitutionDto[]> {
    return this.listEvaluatorInstitutionsService.list()
  }

  @Get('me')
  public evaluatorInstitutionMe(@AuthorizedUser() user: AuthorizedUserDto): Promise<EvaluatorInstitutionDto> {
    return this.evaluatorInstitutionMeService.me(user.id)
  }

  @Get('/:id')
  public findEvaluatorInstitution(
    @Param('id', uuidParamValidation()) evaluatorInstitutionId: string
  ): Promise<EvaluatorInstitutionDto> {
    return this.findEvaluatorInstitutionService.findById(evaluatorInstitutionId)
  }
}