import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateEvaluatorInsitutionAddressDto {
  @ApiProperty({ example: '80620140' })
  @IsNotEmpty()
  @IsString()
  zipcode: string

  @ApiProperty({ example: 'Rua Romédio Dorigo' })
  @IsNotEmpty()
  @IsString()
  addressLine: string

  @ApiProperty({ example: '85' })
  @IsNotEmpty()
  @IsString()
  number: string

  @ApiProperty({ example: '604b' })
  @IsOptional()
  @IsString()
  observation: string

  @ApiProperty({ example: 'Curitiba' })
  @IsNotEmpty()
  @IsString()
  city: string

  @ApiProperty({ example: 'PR' })
  @IsNotEmpty()
  @IsString()
  state: string
}
