import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UnauthorizedError } from '@modules/user/errors'
import { LoggedUser } from '../../../shared/types/logged-user.type'
import { EncrypterService } from '../services/encrypter.service'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class CustomGuard implements CanActivate {
  constructor(
    private readonly encrypterService: EncrypterService,
    private readonly userRepository: UserRepository
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token: string = request?.headers?.authorization

    if (!token) {
      throw new UnauthorizedError()
    }

    const loggedUser = this.getLoggedUser(token)
    await this.verifyUserById(loggedUser)
    this.setUserInRequest(request, loggedUser)

    return Boolean(loggedUser)
  }

  private async verifyUserById(loggedUser: LoggedUser): Promise<void | never> {
    const user = await this.userRepository.findById(loggedUser?.id)

    if (!user) {
      throw new UnauthorizedError()
    }
  }

  private getLoggedUser(token: string): LoggedUser {
    const [, cleanedToken] = token?.split('Bearer ')
    const loggedUser: LoggedUser = this.encrypterService.decodeFn(cleanedToken)

    return loggedUser
  }

  private setUserInRequest(request: any, loggedUser: LoggedUser): void {
    request.user = loggedUser
  }
}
