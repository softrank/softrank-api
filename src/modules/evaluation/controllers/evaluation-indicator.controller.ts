import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { TargetAvaliationDto } from '../dtos/entities'
import { SetExpectedResultIndicatorStatusDto } from '../dtos/evaluation-indicators'
import { SetExpectedResultIndicatorProjectAvaliationDto } from '../dtos/target-avaliation'
import {
  SetExpectedResultIndicatorProjecAvaliationService,
  SetExpectedResultIndicatorStatusService
} from '../services/expected-result-indicator'

@ApiTags('Expected Result Indicator')
@ApiBearerAuth()
@Controller('evaluation-indicator')
export class EvaluationIndicatorController {
  constructor(
    private readonly setExpectedResultIndicatorStatusService: SetExpectedResultIndicatorStatusService,
    private readonly setExpectedResultIndicatorProjecAvaliationService: SetExpectedResultIndicatorProjecAvaliationService
  ) {}

  @Put('expected-result/:id')
  @RouteGuards()
  public setStatus(
    @Param('id', uuidParamValidation()) expectedResultIndicatorId: string,
    @Body() setExpectedResultIndicatorStatusDto: SetExpectedResultIndicatorStatusDto
  ) {
    return this.setExpectedResultIndicatorStatusService.setStatus(expectedResultIndicatorId, setExpectedResultIndicatorStatusDto.status)
  }

  @Post('expected-result/:id/project-avaliation')
  public setExpectedResultProjectAvaliation(
    @Param('id', uuidParamValidation()) expectedResultIndicatorId: string,
    @Body() setExpectedResultIndicatorProjectAvaliationDto: SetExpectedResultIndicatorProjectAvaliationDto
  ): Promise<TargetAvaliationDto> {
    return this.setExpectedResultIndicatorProjecAvaliationService.setAvaliation(
      expectedResultIndicatorId,
      setExpectedResultIndicatorProjectAvaliationDto
    )
  }
}
