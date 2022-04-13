import { Injectable } from '@nestjs/common'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserNotFoundError } from '../errors/user.errors'
import { UserRoleEnum } from '@modules/shared/enums'

@Injectable()
export class UserMeService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async me(userId: string): Promise<UserRoleEnum[]> {
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

  private mapToDto(user: User): UserRoleEnum[] {
    return user.roles.map((role) => role.role)
  }
}
