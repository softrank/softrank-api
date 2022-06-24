import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { TargetAvaliationDto } from '../dtos/entities'
import { SetExpectedResultIndicatorStatusDto } from '../dtos/evaluation-indicators'
import { SetModelCapacityIndicatorStatusDto } from '../dtos/model-capacity-indicator'
import { SetExpectedResultIndicatorProjectAvaliationDto, SetModelCapacityIndicatorTargetAvaliationDto } from '../dtos/target-avaliation'
import { ModelCapacityIndicatorStatusEnum } from '../enums'
import {
  SetExpectedResultIndicatorProjecAvaliationService,
  SetExpectedResultIndicatorStatusService
} from '../services/expected-result-indicator'
import {
  SetModelCapacityIndicatorStatusService,
  SetModelCapacityIndicatorTargetAvaliationService
} from '../services/model-capacity-indicator'

@ApiTags('Expected Result Indicator')
@ApiBearerAuth()
@Controller('evaluation-indicator')
export class EvaluationIndicatorController {
  constructor(
    private readonly setExpectedResultIndicatorStatusService: SetExpectedResultIndicatorStatusService,
    private readonly setExpectedResultIndicatorProjecAvaliationService: SetExpectedResultIndicatorProjecAvaliationService,
    private readonly setModelCapacityIndicatorStatusService: SetModelCapacityIndicatorStatusService,
    private readonly setModelCapacityIndicatorTargetAvaliationService: SetModelCapacityIndicatorTargetAvaliationService
  ) {}

  @Put('expected-result/:id')
  @RouteGuards()
  public setExpectedResultIndicatorStatus(
    @Param('id', uuidParamValidation()) expectedResultIndicatorId: string,
    @Body() setExpectedResultIndicatorStatusDto: SetExpectedResultIndicatorStatusDto
  ) {
    return this.setExpectedResultIndicatorStatusService.setStatus(expectedResultIndicatorId, setExpectedResultIndicatorStatusDto.status)
  }

  @Put('model-capacity/:id')
  @RouteGuards()
  public setModelCapacityIndicatorStatus(
    @Param('id', uuidParamValidation()) modelCapacityIndicatorId: string,
    @Body() setModelCapacityIndicatorStatusDto: SetModelCapacityIndicatorStatusDto
  ) {
    return this.setModelCapacityIndicatorStatusService.setStatus(modelCapacityIndicatorId, setModelCapacityIndicatorStatusDto.status)
  }

  @Post('expected-result/:id/project-avaliation')
  @RouteGuards()
  public setExpectedResultProjectAvaliation(
    @Param('id', uuidParamValidation()) expectedResultIndicatorId: string,
    @Body() setExpectedResultIndicatorProjectAvaliationDto: SetExpectedResultIndicatorProjectAvaliationDto
  ): Promise<TargetAvaliationDto> {
    return this.setExpectedResultIndicatorProjecAvaliationService.setAvaliation(
      expectedResultIndicatorId,
      setExpectedResultIndicatorProjectAvaliationDto
    )
  }

  @Post('model-capacity/:id/target-avaliation')
  @RouteGuards()
  public setModelCapacityIndicatorTargetAvaliation(
    @Param('id', uuidParamValidation()) modelCapacityIndicatorId: string,
    @Body() setModelCapacityIndicatorTargetAvaliationDto: SetModelCapacityIndicatorTargetAvaliationDto
  ): Promise<TargetAvaliationDto> {
    return this.setModelCapacityIndicatorTargetAvaliationService.setTargetAvaliation(
      modelCapacityIndicatorId,
      setModelCapacityIndicatorTargetAvaliationDto
    )
  }
}
