import { IsNotEmpty, IsString, ValidateNested, IsOptional, IsEnum } from 'class-validator'
import { CreateExpectedResultDto } from '@modules/model/dtos'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ModelProcessTypeEnum } from '../enum'

export class CreateModelProcessDto {
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
  @IsEnum(ModelProcessTypeEnum, { message: 'Um belo erro $value' })
  type: ModelProcessTypeEnum

  @ApiProperty({ type: () => [CreateExpectedResultDto] })
  @Type(() => CreateExpectedResultDto)
  @IsOptional()
  @ValidateNested()
  expectedResults: CreateExpectedResultDto[]
}
