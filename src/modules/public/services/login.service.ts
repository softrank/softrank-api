import { EncrypterService, HasherService } from '@modules/public/services'
import { UserUnauthorizedError } from '@modules/public/errors'
import { InjectRepository } from '@nestjs/typeorm'
import { LoginDto } from '@modules/public/dtos'
import { User } from '@modules/public/entities'
import { Repository } from 'typeorm'
import { LoginResponseDto } from '../dtos/login-response.dto'

export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hasherService: HasherService,
    private readonly encrypterService: EncrypterService
  ) {}

  public async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.findUserByLogin(loginDto.login)

    this.verifyPassword(loginDto.password, user.passwordHash)

    const authorizationToken = this.generateAuthorizationToken(user.id)

    return LoginResponseDto.fromEntity(user, authorizationToken)
  }

  private async findUserByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { login },
      relations: ['roles']
    })

    if (!user) {
      throw new UserUnauthorizedError()
    }

    return user
  }

  private verifyPassword(passwordAttempt: string, passwordHash: string) {
    const isValidAttempt = this.hasherService.compare(passwordAttempt, passwordHash)

    if (!isValidAttempt) {
      throw new UserUnauthorizedError()
    }
  }

  private generateAuthorizationToken(id: string): string {
    const authorizationToken = this.encrypterService.encrypt(id)

    return authorizationToken
  }
}
