import { UserRole } from '../entities/user-role.entity'
import { UserRolePath } from '../../shared/enums/user-role-path.enum'

export class UserRoleDto {
  role: string
  path: string

  static fromEntity(userRole: UserRole): UserRoleDto {
    const userRoleDto = new UserRoleDto()

    userRoleDto.role = userRole.role
    userRoleDto.path = UserRolePath[userRole.role]

    return userRoleDto
  }
}
