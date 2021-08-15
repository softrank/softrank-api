import { UserEntity } from '@modules/user/entities'
export class CreateUserDto {
  login: string
  password: string
  entityId: string

  static toEntity(createUserDto: CreateUserDto): UserEntity {
    const user = new UserEntity()

    user.login = createUserDto.login
    user.passwordHash = createUserDto.password
    user.entityId = createUserDto.entityId

    return user
  }
}
