import { CommonEntityAlreadyExistsError, UserNotFoundError } from '@modules/public/errors'
import { Repository, EntityManager, getConnection } from 'typeorm'
import { CommonEntityDto } from '@modules/shared/dtos/public'
import { CommonEntity, User } from '@modules/public/entities'
import { CreateCommonEntityDto } from '@modules/public/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateCommonEntityService {
  constructor(
    @InjectRepository(CommonEntity)
    private readonly commonEntityRepository: Repository<CommonEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(createEntityDto: CreateCommonEntityDto): Promise<CommonEntityDto> {
    const createdCommonEntity = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEntityDto, manager)
    })

    const commonEntityDto = this.transformToCommonEntityDto(createdCommonEntity)
    return commonEntityDto
  }

  public async createWithTransaction(
    createEntityDto: CreateCommonEntityDto,
    manager: EntityManager
  ): Promise<CommonEntity> {
    this.setManager(manager)

    await this.checkCommonEntityConflicts(createEntityDto)
    const commonEntityToCreate = await this.buildCommonEntity(createEntityDto)
    const createdCommonEntity = await this.manager.save(commonEntityToCreate)

    this.cleanManager()

    return createdCommonEntity
  }

  private async checkCommonEntityConflicts({
    documentNumber,
    email
  }: CreateCommonEntityDto): Promise<void | never> {
    const commonEntity = await this.commonEntityRepository
      .createQueryBuilder('commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (commonEntity) {
      throw new CommonEntityAlreadyExistsError()
    }
  }

  private async buildCommonEntity(createEntityDto: CreateCommonEntityDto): Promise<CommonEntity> {
    const commonEntity = new CommonEntity()

    commonEntity.name = createEntityDto.name
    commonEntity.phone = createEntityDto.phone
    commonEntity.email = createEntityDto.email
    commonEntity.documentType = createEntityDto.documentType
    commonEntity.documentNumber = createEntityDto.documentNumber
    commonEntity.user = await this.findUserById(createEntityDto.userId)

    return commonEntity
  }

  private async findUserById(userId?: string): Promise<User> {
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } })

      if (!user) {
        throw new UserNotFoundError()
      }

      return user
    }
  }

  private transformToCommonEntityDto(commonEntity: CommonEntity): CommonEntityDto {
    return CommonEntityDto.fromEntity(commonEntity)
  }
}
