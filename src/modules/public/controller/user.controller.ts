import { createUserControllerDocumentation, loginDocumentation } from '@modules/public/swagger'
import { Body, Controller, HttpCode, Post, HttpStatus } from '@nestjs/common'
import { LoginService, CreateUserService } from '@modules/public/services'
import { LoginDto, CreateUserDto } from '@modules/public/dtos'
import { ApiTags } from '@nestjs/swagger'

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly loginService: LoginService, private readonly createUserService: CreateUserService) {}

  @Post('auth')
  @loginDocumentation()
  public async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.loginService.login(loginDto)
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @createUserControllerDocumentation()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.createUserService.create(createUserDto)
  }
}
