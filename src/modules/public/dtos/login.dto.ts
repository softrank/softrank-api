import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'luckmfv@gmail.com' })
  login: string

  @ApiProperty({ example: 'dificil123' })
  password: string
}
