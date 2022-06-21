import { RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { CreateAdjustmentDto, UpdateAdjustmentDto } from '../dtos/ajustment'
import { AdjustmentDto } from '../dtos/entities'
import { CreateAdjustmentService } from '../services'
import { UpdateAdjustmentService, FindAdjustmentByIdService, DeleteAdjustmentService } from '../services/adjustment'

@ApiTags('Adjustment')
@Controller('adjustments')
export class AdjustmentController {
  constructor(
    private readonly createAjustmentService: CreateAdjustmentService,
    private readonly deleteAdjustmentService: DeleteAdjustmentService,
    private readonly updateAdjustmentService: UpdateAdjustmentService,
    private readonly findAdjustmentByIdService: FindAdjustmentByIdService
  ) {}

  @Post()
  @RouteGuards()
  public create(@Body() createAjustmentDto: CreateAdjustmentDto): Promise<AdjustmentDto> {
    return this.createAjustmentService.create(createAjustmentDto)
  }

  @Put(':id')
  @RouteGuards()
  public update(@Param('id', uuidParamValidation()) adjustmentId: string, @Body() body: UpdateAdjustmentDto): Promise<AdjustmentDto> {
    const updateAdjustmentDto = new UpdateAdjustmentDto(body, adjustmentId)
    return this.updateAdjustmentService.update(updateAdjustmentDto)
  }

  @Get(':id')
  @RouteGuards()
  public findById(@Param('id', uuidParamValidation()) adjustmentId: string): Promise<AdjustmentDto> {
    return this.findAdjustmentByIdService.find(adjustmentId)
  }

  @Delete(':id')
  @RouteGuards()
  public delete(@Param('id', uuidParamValidation()) adjustmentId: string): Promise<void> {
    return this.deleteAdjustmentService.delete(adjustmentId)
  }
}
