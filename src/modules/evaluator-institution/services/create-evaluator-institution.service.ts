import {
  CreateEvaluatorInsitutionAddressDto,
  CreateEvaluatorInstitutionDto
} from '@modules/evaluator-institution/dtos'
import { EvaluatorInstitutionAddress, EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { EvaluatorInstitutionDto } from '@modules/shared/dtos/evaluator-institution'
import { CreateCommonEntityService } from '@modules/public/services'
import { CreateCommonEntityDto } from '@modules/public/dtos'
import { CommonEntity } from '@modules/public/entities'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EvaluatorInstitutionAlreadyExistsError } from '../errors/evaluator-institution.errors'

@Injectable()
export class CreateEvaluatorInstitutionService {
  constructor(private readonly createCommonEntityService: CreateCommonEntityService) {}

  private manager: EntityManager

  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

  public async create(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    userId: string
  ): Promise<EvaluatorInstitutionDto> {
    const createdEvaluatorInstitution = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithTransaction(createEvaluatorInstitutionDto, userId, manager)
    })

    return EvaluatorInstitutionDto.fromEntity(createdEvaluatorInstitution)
  }

  public async createWithTransaction(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    userId: string,
    manager: EntityManager
  ): Promise<EvaluatorInstitution> {
    this.setManager(manager)

    await this.verifyEvaluatorInstitutionConflicts(createEvaluatorInstitutionDto)
    const commonEntity = await this.findCommonEntity(createEvaluatorInstitutionDto)
    const builtEvaluatorInstitution = await this.buildEvaluatorInstitutionEntity(
      createEvaluatorInstitutionDto,
      commonEntity,
      userId
    )
    const createdEvaluatorInstitution = await this.manager.save(builtEvaluatorInstitution)

    this.cleanManager()
    return createdEvaluatorInstitution
  }

  private async verifyEvaluatorInstitutionConflicts({
    documentNumber,
    email
  }: CreateEvaluatorInstitutionDto): Promise<void | never> {
    const evaluatorInstitution = await this.manager
      .createQueryBuilder(EvaluatorInstitution, 'evaluatorInstitution')
      .leftJoin('evaluatorInstitution.commonEntity', 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    if (evaluatorInstitution) {
      throw new EvaluatorInstitutionAlreadyExistsError()
    }
  }

  private async findCommonEntity({
    documentNumber,
    email
  }: CreateEvaluatorInstitutionDto): Promise<CommonEntity> {
    const commonEntity = await this.manager
      .createQueryBuilder(CommonEntity, 'commonEntity')
      .where('commonEntity.documentNumber = :documentNumber', { documentNumber })
      .orWhere('commonEntity.email = :email', { email })
      .getOne()

    return commonEntity
  }

  private async createCommonEntity(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    userId: string
  ): Promise<CommonEntity> {
    const dto = this.transformToCreateCommonEntityDto(createEvaluatorInstitutionDto, userId)
    const createdCommonEntity = await this.createCommonEntityService.createWithTransaction(dto, this.manager)

    return createdCommonEntity
  }

  private transformToCreateCommonEntityDto(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    userId: string
  ): CreateCommonEntityDto {
    const dto = new CreateCommonEntityDto()

    dto.documentNumber = createEvaluatorInstitutionDto.documentNumber
    dto.documentType = createEvaluatorInstitutionDto.documentType
    dto.email = createEvaluatorInstitutionDto.email
    dto.name = createEvaluatorInstitutionDto.name
    dto.phone = createEvaluatorInstitutionDto.phone
    dto.userId = userId

    return dto
  }

  private async buildEvaluatorInstitutionEntity(
    createEvaluatorInstitutionDto: CreateEvaluatorInstitutionDto,
    commonEntity: CommonEntity,
    userId: string
  ): Promise<EvaluatorInstitution> {
    const evaluatorInstitution = new EvaluatorInstitution()

    evaluatorInstitution.addresses = this.buildEvaluatorInstitutionAddressEntity(
      createEvaluatorInstitutionDto.address
    )
    evaluatorInstitution.commonEntity =
      commonEntity || (await this.createCommonEntity(createEvaluatorInstitutionDto, userId))

    evaluatorInstitution.id = evaluatorInstitution.commonEntity.id
    return evaluatorInstitution
  }

  private buildEvaluatorInstitutionAddressEntity(
    createEvaluatorInsitutionAddressDto: CreateEvaluatorInsitutionAddressDto
  ): EvaluatorInstitutionAddress[] {
    const evaluatorInstitutionAddress = new EvaluatorInstitutionAddress()

    evaluatorInstitutionAddress.zipcode = createEvaluatorInsitutionAddressDto.zipcode
    evaluatorInstitutionAddress.addressLine = createEvaluatorInsitutionAddressDto.addressLine
    evaluatorInstitutionAddress.number = createEvaluatorInsitutionAddressDto.number
    evaluatorInstitutionAddress.observation = createEvaluatorInsitutionAddressDto.observation
    evaluatorInstitutionAddress.state = createEvaluatorInsitutionAddressDto.state
    evaluatorInstitutionAddress.city = createEvaluatorInsitutionAddressDto.city

    return [evaluatorInstitutionAddress]
  }
}
