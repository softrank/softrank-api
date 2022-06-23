import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { ModelCapacityTypeEnum } from '../enum'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateModelCapacityDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  id: string

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
