import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getConnection, EntityManager } from 'typeorm'
import { User } from '../entities'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UserAlreadyExistsError } from '../errors/user.errors'
import { HasherService } from './hasher.service'

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hasherService: HasherService
  ) {}

  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createUserDto, manager)
    })

    return createdUser
  }

  public async createWithTransaction(createUserDto: CreateUserDto, manager: EntityManager): Promise<User> {
    this.setManager(manager)

    await this.verifyUserConflicts(createUserDto.login)
    const userToCreate = this.buildUserEntity(createUserDto)
    const savedUser = this.manager.save(userToCreate)

    this.cleanManager()
    return savedUser
  }

  private async verifyUserConflicts(login: string): Promise<void | never> {
    const user = await this.userRepository.findOne({
      where: { login }
    })

    if (user) {
      throw new UserAlreadyExistsError()
    }
  }

  private buildUserEntity(createUserDto: CreateUserDto): User {
    const user = new User()
    const passwordHash = this.hasherService.hash(createUserDto.password)

    user.login = createUserDto.login
    user.passwordHash = passwordHash

    return user
  }
}
