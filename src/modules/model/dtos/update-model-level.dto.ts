import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { v4 } from 'uuid'

export class UpdateModelLevelDto {
  @ApiProperty({ example: v4(), required: false })
  @IsOptional()
  @IsUUID('4')
  id: string

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
