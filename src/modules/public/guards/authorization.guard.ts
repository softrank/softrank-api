import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities'
import { UserUnauthorizedError } from '../errors/user.errors'
import { EncrypterService } from '../services/encrypter.service'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly encrypterService: EncrypterService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('oi')
    const authorizationToken = this.getAuthorizationTokenFromRequest(context)
    const authorizedUser = this.decodeAuthorizationToken(authorizationToken)
    await this.verifyUserId(authorizedUser.id)
    this.setUserInRequest(context, authorizedUser)

    return true
  }

  private getAuthorizationTokenFromRequest(context: ExecutionContext): string {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest()
    const authorizationToken = request?.headers?.authorization

    if (!authorizationToken) {
      throw new UserUnauthorizedError()
    }

    const [_prefix, token] = authorizationToken.split(' ')

    return token
  }

  private decodeAuthorizationToken(token: string): AuthorizedUserDto {
    const authorizedUser = this.encrypterService.decode(token)
    return authorizedUser
  }

  private async verifyUserId(userId: string): Promise<void | never> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    })

    if (!user) {
      throw new UserUnauthorizedError()
    }
  }

  private setUserInRequest(context: ExecutionContext, user: AuthorizedUserDto): void {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest()
    request.user = user
  }
}
