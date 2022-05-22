import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateAdjustmentDto } from '../dtos/ajustment'
import { CreateAdjustmentService } from '../services'

@ApiTags('Adjustment')
@Controller('adjustments')
export class AdjustmentController {
  constructor(private readonly createAjustmentService: CreateAdjustmentService) {}

  @Post()
  @RouteGuards()
  public create(@Body() createAjustmentDto: CreateAdjustmentDto): Promise<any> {
    return this.createAjustmentService.create(createAjustmentDto)
  }
}
