import { EncrypterService, HasherService } from '@modules/public/services'
import { UserUnauthorizedError } from '@modules/public/errors'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@modules/public/entities'
import { Repository } from 'typeorm'
import { LoginResponseDto } from '../dtos/login-response.dto'

export class LoginAfterCreateService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encrypterService: EncrypterService
  ) {}

  public async login(userId: string): Promise<LoginResponseDto> {
    const user = await this.findUserById(userId)
    const authToken = this.generateAuthorizationToken(userId)
    const loginResponseDto = LoginResponseDto.fromEntity(user, authToken)

    return loginResponseDto
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles']
    })

    if (!user) {
      throw new UserUnauthorizedError()
    }

    return user
  }

  private generateAuthorizationToken(id: string): string {
    const authorizationToken = this.encrypterService.encrypt(id)

    return authorizationToken
  }
}
