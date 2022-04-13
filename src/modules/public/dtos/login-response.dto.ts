import { UserRoleEnum } from '@modules/shared/enums'
import { User } from '@modules/public/entities'

export class LoginResponseDto {
  authToken: string
  roles: UserRoleEnum[]

  static fromEntity(user: User, authToken: string): LoginResponseDto {
    const loginResponseDto = new LoginResponseDto()

    loginResponseDto.authToken = authToken
    loginResponseDto.roles = user.roles?.map((role) => role.role)

    return loginResponseDto
  }
}
