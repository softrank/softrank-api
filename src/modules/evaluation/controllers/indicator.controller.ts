import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateIndicatorService } from '../services/create-indicator.service'
import { UpdateIndicatorBodyDto, UpdateIndicatorDto } from '../dtos/update-indicator.dto'
import { UpdateIndicatorService } from '../services/update-indicator.service'

@ApiTags('Indicator')
@Controller('indicator')
@RouteGuards()
export class IndicatorController {
  constructor(
    private readonly createIndicatorService: CreateIndicatorService,
    private readonly updateIndicatorService: UpdateIndicatorService
  ) {}

  @Post(':expectedResultId')
  public createIndicator(@Param('expectedResultId') expectedResultId: string): Promise<any> {
    return this.createIndicatorService.create(expectedResultId)
  }

  @Put(':indicatorId')
  public updateIndicator(
    @Param('indicatorId') indicatorId: string,
    @Body() updateIndicatorBodyDto: UpdateIndicatorBodyDto
  ) {
    const updateIndicatorDto = new UpdateIndicatorDto(indicatorId, updateIndicatorBodyDto)
    return this.updateIndicatorService.update(updateIndicatorDto)
  }
}
