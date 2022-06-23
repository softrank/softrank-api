import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ModelCapacityTypeEnum } from '../enum'

export class CreateModelCapacityDto {
  @ApiProperty({ example: 'O processo produz os resultados definidos.' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: ModelCapacityTypeEnum.ORGANIZATIONAL })
  @IsNotEmpty()
  @IsEnum(ModelCapacityTypeEnum)
  type: ModelCapacityTypeEnum

  @ApiProperty({ example: 'G' })
  @IsNotEmpty()
  @IsString()
  minLevel: string

  @ApiProperty({ example: 'G' })
  @IsNotEmpty()
  @IsString()
  maxLevel: string
}
