import { applyDecorators, UseGuards, CanActivate } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthorizationGuard } from '../../public/guards/authorization.guard'

export function RouteGuards(...guards: CanActivate[]): MethodDecorator & ClassDecorator {
  return applyDecorators(ApiBearerAuth(), UseGuards(AuthorizationGuard, ...guards))
}
