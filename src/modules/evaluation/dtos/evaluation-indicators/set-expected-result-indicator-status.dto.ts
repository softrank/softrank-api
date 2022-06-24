import { ExpectedResultIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class SetExpectedResultIndicatorStatusDto {
  @ApiProperty({ example: ExpectedResultIndicatorStatusEnum.WIDELY, enum: Object.values(ExpectedResultIndicatorStatusEnum) })
  @IsEnum(ExpectedResultIndicatorStatusEnum)
  status: ExpectedResultIndicatorStatusEnum
}
