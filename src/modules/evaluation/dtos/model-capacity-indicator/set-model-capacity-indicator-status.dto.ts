import { ModelCapacityIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class SetModelCapacityIndicatorStatusDto {
  @ApiProperty({ example: ModelCapacityIndicatorStatusEnum.OUT_SCOPED, enum: Object.values(ModelCapacityIndicatorStatusEnum) })
  @IsEnum(ModelCapacityIndicatorStatusEnum)
  status: ModelCapacityIndicatorStatusEnum
}
