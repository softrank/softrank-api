import { CanActivate, ExecutionContext } from '@nestjs/common'
import { UnauthorizedError } from '@modules/user/errors'

export class CustomGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request?.headers?.authorization

    if (!token) {
      throw new UnauthorizedError()
    }

    return null
  }
}
