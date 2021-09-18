import { CreateEvaluatorDto, EvaluatorDto } from '@modules/entity/dtos'
import { EntityRepository } from '@modules/entity/repositories'
import { EvaluatorConflictError } from '@modules/entity/errors'
import { CreateUserDto, UserDto } from '@modules/user/dtos'
import { CreateUserService } from '@modules/user/services'
import { EntityEntity } from '@modules/entity/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateEvaluatorService {
  constructor(
    private readonly entityRepository: EntityRepository,
    private readonly createUserService: CreateUserService
  ) {}
  async create(createEvaluatorDto: CreateEvaluatorDto): Promise<EvaluatorDto> {
    await this.verifyEvaluatorConflicts(createEvaluatorDto)
    const evaluator = this.buildEvaluator(createEvaluatorDto)
    const savedEvaluator = await this.entityRepository.create(evaluator)
    const { id: userId } = await this.createUser(
      savedEvaluator.id,
      createEvaluatorDto
    )

    await this.entityRepository.setUserId(savedEvaluator.id, userId)

    return this.mapToDto(savedEvaluator)
  }

  private async verifyEvaluatorConflicts(
    createEvaluatorDto: CreateEvaluatorDto
  ): Promise<void | never> {
    const hasDocumentNumberConlict =
      await this.entityRepository.findByDocumentNumber(
        createEvaluatorDto.documentNumber
      )

    const hasEmailConflict = await this.entityRepository.findByEmail(
      createEvaluatorDto.email
    )

    if (hasDocumentNumberConlict || hasEmailConflict) {
      throw new EvaluatorConflictError()
    }
  }

  private buildEvaluator(createEvaluatorDto: CreateEvaluatorDto): EntityEntity {
    const evaluator = CreateEvaluatorDto.toEntity(createEvaluatorDto)
    return evaluator
  }

  private async createUser(
    id: string,
    createEvaluatorDto: CreateEvaluatorDto
  ): Promise<UserDto> {
    const createUserDto = this.mapToCreateUserDto(id, createEvaluatorDto)
    return await this.createUserService.create(createUserDto)
  }

  private mapToCreateUserDto(
    id: string,
    { password, email }: CreateEvaluatorDto
  ): CreateUserDto {
    const dto = new CreateUserDto()

    dto.entityId = id
    dto.login = email
    dto.password = password

    return dto
  }

  private mapToDto(entity: EntityEntity): EvaluatorDto {
    return EvaluatorDto.fromEntity(entity)
  }
}
