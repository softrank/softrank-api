import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyIfEvaluationHasModelCapacityTypeDto {
  @ApiProperty({ example: ModelCapacityTypeEnum.ORGANIZATIONAL })
  @IsNotEmpty()
  @IsEnum(ModelCapacityTypeEnum)
  type: ModelCapacityTypeEnum
}
