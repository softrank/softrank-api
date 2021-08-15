import { UserEntity } from '@modules/user/entities'

export class UserDto {
  id: string
  login: string
  recoveryToken: string
  entityId: string

  static fromEntity(userEntity: UserEntity): UserDto {
    const dto = new UserDto()

    dto.id = userEntity.id
    dto.login = userEntity.login
    dto.recoveryToken = userEntity.recoveryToken
    dto.entityId = userEntity.entityId

    return dto
  }
}
