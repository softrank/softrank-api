import { EncrypterService, HasherService } from '@modules/user/services'
import { UserRepository } from '@modules/user/repositories'
import { UnauthorizedError } from '@modules/user/errors'
import { UserEntity } from '@modules/user/entities'
import { SignInDto } from '@modules/user/dtos'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SignInService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypterService: EncrypterService,
    private readonly hasherService: HasherService
  ) {}
  async signIn(signInAttempt: SignInDto): Promise<string> {
    const user = await this.findUserLogin(signInAttempt)
    const authorizationToken = this.createAuthorizationToken(user.id)

    return authorizationToken
  }

  private async findUserLogin(signInAttempt: SignInDto): Promise<UserEntity> {
    const user = await this.userRepository.findByLogin(signInAttempt.login)
    this.verifyUserPassword(signInAttempt, user)

    return user
  }

  private verifyUserPassword(
    signInAttempt: SignInDto,
    user: UserEntity
  ): void | never {
    const isValidAttempt = this.hasherService.compare(
      signInAttempt.password,
      user?.passwordHash
    )

    if (!user || !isValidAttempt) {
      throw new UnauthorizedError()
    }
  }

  private createAuthorizationToken(id: string): string {
    return this.encrypterService.encrypt(id)
  }
}
