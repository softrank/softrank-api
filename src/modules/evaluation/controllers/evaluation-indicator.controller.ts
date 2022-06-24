import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { SetExpectedResultIndicatorStatusDto } from '../dtos/evaluation-indicators'
import { SetExpectedResultIndicatorStatusService } from '../services/expected-result-indicator'

@ApiTags('Expected Result Indicator')
@ApiBearerAuth()
@Controller('evaluation-indicator')
export class EvaluationIndicatorController {
  constructor(private readonly setExpectedResultIndicatorStatusService: SetExpectedResultIndicatorStatusService) {}

  @Put('/expected-result/:id')
  @RouteGuards()
  public setStatus(
    @Param('id', uuidParamValidation()) expectedResultIndicatorId: string,
    @Body() setExpectedResultIndicatorStatusDto: SetExpectedResultIndicatorStatusDto
  ) {
    return this.setExpectedResultIndicatorStatusService.setStatus(expectedResultIndicatorId, setExpectedResultIndicatorStatusDto.status)
  }
}
