import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateModelBodyDto {
  @ApiProperty({
    example: 'SRK-Serviços-V2'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: new Date()
  })
  @IsNotEmpty()
  year: Date

  @ApiProperty({
    example: 'Uma bela descrição 2'
  })
  @IsNotEmpty()
  @IsString()
  description: string
}

export class UpdateModelDto extends UpdateModelBodyDto {
  constructor(updateModelDto: UpdateModelDto) {
    super()
    this.id = updateModelDto.id
    this.name = updateModelDto.name
    this.year = updateModelDto.year
    this.description = updateModelDto.description
  }

  id: string
}
