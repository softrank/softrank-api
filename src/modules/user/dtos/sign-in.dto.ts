import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty({
    example: 'login'
  })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiProperty({
    example: 'dificil123'
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
