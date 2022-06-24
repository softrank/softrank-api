import { TargetAvaliationStatusEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

export class SetModelCapacityIndicatorTargetAvaliationDto {
  @ApiProperty()
  @IsUUID('4')
  targetId: string

  @ApiProperty({ example: TargetAvaliationStatusEnum.PARCIALLY, enum: Object.values(TargetAvaliationStatusEnum) })
  @IsEnum(TargetAvaliationStatusEnum)
  status: TargetAvaliationStatusEnum
}
