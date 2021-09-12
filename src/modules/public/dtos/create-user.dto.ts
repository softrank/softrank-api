import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'luckmfv@gmail.com' })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiProperty({ example: 'dificil123' })
  @IsString()
  @IsNotEmpty()
  password: string
}
