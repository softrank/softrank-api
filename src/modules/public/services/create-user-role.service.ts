import { UserNotFoundError, UserRoleAlreadyExistsError } from '@modules/public/errors'
import { User, UserRole } from '@modules/public/entities'
import { ManagedService } from '@modules/shared/services'
import { CreateUserRoleDto } from '@modules/public/dtos'
import { getConnection, EntityManager } from 'typeorm'
import { UserRoleEnum } from '@modules/shared/enums'

export class CreateUserRoleService extends ManagedService {
  public async create(createUserRoleDto: CreateUserRoleDto): Promise<void> {
    await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createUserRoleDto, manager)
    })
  }

  public async createWithTransaction(
    createUserRoleDto: CreateUserRoleDto,
    manager: EntityManager
  ): Promise<void> {
    this.setManager(manager)

    const user = await this.findUserById(createUserRoleDto.userId)
    await this.checkIfRoleAlreadyExists(createUserRoleDto)
    const userRole = this.buildUserRoleEntity(createUserRoleDto.role, user)
    await manager.save(userRole)

    this.cleanManager()
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.manager.findOne(User, { where: { id: userId } })

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  private async checkIfRoleAlreadyExists(createUserRoleDto: CreateUserRoleDto): Promise<void | never> {
    const userRole = await this.manager
      .createQueryBuilder(UserRole, 'userRole')
      .where('userRole.userId = :userId', { userId: createUserRoleDto.userId })
      .andWhere('userRole.role = :role', { role: createUserRoleDto.role })
      .getOne()

    if (userRole) {
      throw new UserRoleAlreadyExistsError()
    }
  }

  private buildUserRoleEntity(role: UserRoleEnum, user: User): UserRole {
    const userRole = new UserRole()

    userRole.role = role
    userRole.user = user

    return userRole
  }
}
