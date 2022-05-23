import { IndicatorStatusEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class SetIndicatorStatusDto {
  constructor(public readonly indicatorId: string, status: IndicatorStatusEnum) {
    this.status = status
  }

  @ApiProperty({ example: IndicatorStatusEnum.COMPLETE })
  @IsNotEmpty()
  @IsEnum(IndicatorStatusEnum)
  status: IndicatorStatusEnum
}
