import { createUserControllerDocumentation, loginDocumentation } from '@modules/public/swagger'
import { Body, Controller, HttpCode, Post, HttpStatus, Get } from '@nestjs/common'
import { LoginService, CreateUserService } from '@modules/public/services'
import { LoginDto, CreateUserDto } from '@modules/public/dtos'
import { ApiTags } from '@nestjs/swagger'
import { LoginResponseDto } from '../dtos/login-response.dto'
import { RouteGuards } from '../../shared/decorators/route-guards.decorator'
import { AuthorizedUser } from '@modules/shared/decorators'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { UserMeService } from '../services/user-me.service'

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly loginService: LoginService,
    private readonly createUserService: CreateUserService,
    private readonly userMeService: UserMeService
  ) {}

  @Post('auth')
  @loginDocumentation()
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.loginService.login(loginDto)
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @createUserControllerDocumentation()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.createUserService.create(createUserDto)
  }

  @Get('me')
  @RouteGuards()
  public userMe(@AuthorizedUser() user: AuthorizedUserDto) {
    return this.userMeService.me(user.id)
  }
}
