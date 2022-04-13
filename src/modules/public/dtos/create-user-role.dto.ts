import { UserRoleEnum } from '@modules/shared/enums'

export class CreateUserRoleDto {
  userId: string
  role: UserRoleEnum
}
