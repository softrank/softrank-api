import { IndicatorTypeEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

export class CreateIndicatorDto {
  @ApiProperty({ example: IndicatorTypeEnum.EXPECTED_RESULT })
  @IsOptional()
  @IsEnum(IndicatorTypeEnum)
  type: IndicatorTypeEnum = IndicatorTypeEnum.EXPECTED_RESULT
}
