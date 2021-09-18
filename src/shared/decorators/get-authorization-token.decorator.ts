import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UnauthorizedError } from '@modules/user/errors'

export const GetUser = createParamDecorator(
  (__: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const loggedUser = request?.user

    if (!loggedUser) {
      throw new UnauthorizedError()
    }

    return loggedUser
  }
)
