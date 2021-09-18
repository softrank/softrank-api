import { SignInDocumentation } from '@modules/user/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { SignInService } from '@modules/user/services'
import { SignInDto } from '@modules/user/dtos'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post()
  @SignInDocumentation()
  async signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.signInService.signIn(signInDto)
  }
}
