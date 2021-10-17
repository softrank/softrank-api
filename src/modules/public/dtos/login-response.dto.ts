import { UserRoleDto } from './user-role.dto'
import { User } from '../entities/user.entity'

export class LoginResponseDto {
  authToken: string
  roles: UserRoleDto[]

  static fromEntity(user: User, authToken: string): LoginResponseDto {
    const loginResponseDto = new LoginResponseDto()

    loginResponseDto.authToken = authToken
    loginResponseDto.roles = user.roles?.map((role) => UserRoleDto.fromEntity(role))

    return loginResponseDto
  }
}
