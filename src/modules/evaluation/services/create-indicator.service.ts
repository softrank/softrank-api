import { Injectable } from '@nestjs/common'
import { Indicator } from '../entities/indicator.entity'
import { getConnection, Repository, EntityManager } from 'typeorm'
import { ExpectedResultIndicator, ModelCapacityIndicator } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { ExpectedResultIndicatorNotFoundError, ModelCapacityIndicatorNotFoundError } from '../errors'
import { IndicatorDto } from '../dtos/entities'
import { CreateIndicatorDto } from '../dtos/indicator'
import { IndicatorTypeEnum } from '../enums'

@Injectable()
export class CreateEmptyIndicatorService {
  constructor(
    @InjectRepository(ExpectedResultIndicator)
    private readonly expectedResultIndicatorRepository: Repository<ExpectedResultIndicator>,
    @InjectRepository(ModelCapacityIndicator)
    private readonly modelCapacityIndicatorRepository: Repository<ModelCapacityIndicator>
  ) {}

  public async create(expectedResultIndicatorId: string, createIndicatorDto: CreateIndicatorDto): Promise<IndicatorDto> {
    const indicator = await getConnection().transaction((manager) => {
      return this.createWithTransaction(expectedResultIndicatorId, createIndicatorDto, manager)
    })

    const indicatorDto = IndicatorDto.fromEntity(indicator)
    return indicatorDto
  }

  public async createWithTransaction(targetId: string, createIndicatorDto: CreateIndicatorDto, manager: EntityManager): Promise<Indicator> {
    const target = await this.findTargetByType(targetId, createIndicatorDto.type)
    const indicatorToCreate = this.buildIndicator(target)
    const indicator = await manager.save(indicatorToCreate)

    return indicator
  }

  private async findTargetByType(targetId: string, type: IndicatorTypeEnum): Promise<ModelCapacityIndicator | ExpectedResultIndicator> {
    if (type === IndicatorTypeEnum.MODEL_CAPACITY) {
      const modelCapacityIndicator = await this.findModelCapacityIndicatorById(targetId)
      return modelCapacityIndicator
    } else {
      const expectedResultIndicator = await this.findExpectedResultIndicatorById(targetId)
      return expectedResultIndicator
    }
  }

  private async findModelCapacityIndicatorById(modelCapacityIndicatorById: string): Promise<ModelCapacityIndicator> {
    const modelCapacityIndicator = await this.modelCapacityIndicatorRepository
      .createQueryBuilder('modelCapacityIndicator')
      .where('modelCapacityIndicator.id = :modelCapacityIndicatorById')
      .setParameters({ modelCapacityIndicatorById })
      .getOne()

    if (!modelCapacityIndicator) {
      throw new ModelCapacityIndicatorNotFoundError()
    }

    return modelCapacityIndicator
  }

  private async findExpectedResultIndicatorById(expectedResultIndicatorId: string): Promise<ExpectedResultIndicator> {
    const expectedResultIndicator = await this.expectedResultIndicatorRepository
      .createQueryBuilder('expectedResultIndicator')
      .where('expectedResultIndicator.id = :expectedResultIndicatorId')
      .setParameters({ expectedResultIndicatorId })
      .getOne()

    if (!expectedResultIndicator) {
      throw new ExpectedResultIndicatorNotFoundError()
    }

    return expectedResultIndicator
  }

  private buildIndicator(targetEntity: ExpectedResultIndicator | ModelCapacityIndicator): Indicator {
    const indicator = new Indicator()

    if (targetEntity instanceof ExpectedResultIndicator) {
      indicator.expectedResultIndicator = targetEntity
    }

    if (targetEntity instanceof ModelCapacityIndicator) {
      indicator.modelCapacityIndicator = targetEntity
    }

    return indicator
  }
}
