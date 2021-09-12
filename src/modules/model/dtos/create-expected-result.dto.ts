import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ExpectedResult } from '../entities/expected-result.entity'

export class CreateExpectedResultDto {
  @ApiProperty({ example: 'O escopo do trabalho para o projeto é definido' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'Gpr-1' })
  @IsNotEmpty()
  @IsString()
  initial: string

  @ApiProperty({
    example:
      'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregar' +
      'um produto que satisfaça as necessidades, características e funções especificadas' +
      'para o projeto, de forma a concluí-lo com sucesso.'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ example: 'G' })
  @IsNotEmpty()
  @IsString()
  minLevel: string

  @ApiProperty({ example: 'G' })
  @IsOptional()
  @IsString()
  maxLevel: string

  static toEntity(createExpectedResultDto: CreateExpectedResultDto): ExpectedResult {
    const entity = new ExpectedResult()

    entity.initial = createExpectedResultDto.initial
    entity.maxLevel = createExpectedResultDto.maxLevel
    entity.minLevel = createExpectedResultDto.minLevel
    entity.name = createExpectedResultDto.name
    entity.description = createExpectedResultDto.description

    return entity
  }
}
