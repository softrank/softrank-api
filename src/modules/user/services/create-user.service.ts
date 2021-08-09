import { UserLoginALreadyExistsError } from '@modules/user/errors'
import { UserRepository } from '@modules/user/repositories'
import { HasherService } from '@modules/user/services'
import { UserEntity } from '@modules/user/entities'
import { CreateUserDto } from '@modules/user/dtos'
import { Injectable } from '@nestjs/common'
import { UserDto } from '../dtos/user.dto'

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasherService: HasherService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    await this.checkUserConflicts(createUserDto.login)
    const userEntity = this.buildUserEntity(createUserDto)
    const savedUser = await this.userRepository.create(userEntity)

    return this.mapToDto(savedUser)
  }

  private async checkUserConflicts(login: string): Promise<void | never> {
    const hasConflict = await this.userRepository.findByLogin(login)

    if (hasConflict) {
      throw new UserLoginALreadyExistsError()
    }
  }

  private buildUserEntity(createUserDto: CreateUserDto): UserEntity {
    const password = this.hasherService.hash(createUserDto.password)
    return CreateUserDto.toEntity(Object.assign(createUserDto, { password }))
  }

  private mapToDto(userEntity: UserEntity): UserDto {
    return UserDto.fromEntity(userEntity)
  }
}
