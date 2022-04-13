import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ModelLevel } from '../entities/model-level.entity'

export class CreateModelLevelDto {
  @ApiProperty({ example: 'G' })
  @IsNotEmpty()
  @IsString()
  initial: string

  @ApiProperty({ example: 'Parcialmente-Gerenciado' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsString()
  predecessor: string
}
