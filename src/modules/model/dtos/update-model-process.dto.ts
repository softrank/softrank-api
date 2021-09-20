import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested, IsOptional, IsUUID } from 'class-validator'
import { UpdateExpectedResultDto } from '@modules/model/dtos'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { v4 } from 'uuid'

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

  @ApiProperty({ type: () => [UpdateExpectedResultDto] })
  @Type(() => UpdateExpectedResultDto)
  @ArrayNotEmpty()
  @ValidateNested()
  expectedResults: UpdateExpectedResultDto[]
}
