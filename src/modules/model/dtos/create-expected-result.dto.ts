import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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
}
