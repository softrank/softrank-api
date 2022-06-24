import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class ListEvaluationModelCapacitiesIndicatorsQueryDto {
  @ApiProperty({ example: ModelCapacityTypeEnum.PROJECT, required: false })
  @IsOptional()
  @IsEnum(ModelCapacityTypeEnum)
  type: ModelCapacityTypeEnum
}
