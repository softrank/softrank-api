import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListEvaluationModelCapacitiesIndicatorsQueryDto {
  @ApiProperty({ example: ModelCapacityTypeEnum.PROJECT, required: false })
  @IsOptional()
  @IsEnum(ModelCapacityTypeEnum)
  type: ModelCapacityTypeEnum
}
