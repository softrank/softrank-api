import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthorizedUserDto } from '../dtos/public/authorized-user.dto'

export const AuthorizedUser = createParamDecorator((_: undefined, context: ExecutionContext): AuthorizedUserDto => {
  const httpContext = context.switchToHttp()
  const request = httpContext.getRequest()
  const user = request.user

  return user
})
