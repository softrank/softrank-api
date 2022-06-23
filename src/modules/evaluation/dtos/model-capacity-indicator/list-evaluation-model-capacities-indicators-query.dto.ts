import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class ListEvaluationModelCapacitiesIndicatorsQueryDto {
  @ApiProperty({ example: ModelCapacityTypeEnum.PROJECT })
  @IsNotEmpty()
  @IsEnum(ModelCapacityTypeEnum)
  type: ModelCapacityTypeEnum
}
