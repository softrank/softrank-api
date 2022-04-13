import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEnum
} from 'class-validator'
import { UpdateExpectedResultDto } from '@modules/model/dtos'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { v4 } from 'uuid'
import { ModelProcessTypeEnum } from '../enum'

export class UpdateModelProcessDto {
  @ApiProperty({ example: v4(), required: false })
  @IsOptional()
  @IsUUID('4')
  id: string

  @ApiProperty({ example: 'Gerencia de Projetos' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'GPR' })
  @IsNotEmpty()
  @IsString()
  initial: string

  @ApiProperty({ example: 'Define a maturidade de gerencia de projetos' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ example: ModelProcessTypeEnum.PROJECT })
  @IsNotEmpty()
  @IsEnum(ModelProcessTypeEnum)
  type: ModelProcessTypeEnum

  @ApiProperty({ type: () => [UpdateExpectedResultDto] })
  @Type(() => UpdateExpectedResultDto)
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested()
  expectedResults: UpdateExpectedResultDto[]
}
