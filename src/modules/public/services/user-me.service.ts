import { Injectable } from '@nestjs/common'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserNotFoundError } from '../errors/user.errors'
import { UserRoleDto } from '../dtos/user-role.dto'

@Injectable()
export class UserMeService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async me(userId: string): Promise<UserRoleDto[]> {
    const user = await this.findUserById(userId)
    const mappedRoles = this.mapToDto(user)

    return mappedRoles
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles']
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  private mapToDto(user: User): UserRoleDto[] {
    return user.roles.map((role) => UserRoleDto.fromEntity(role))
  }
}
