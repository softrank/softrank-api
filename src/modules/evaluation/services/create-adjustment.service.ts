import { EntityManager, getConnection, Repository } from 'typeorm'
import { ExpectedResultIndicatorNotFoundError } from '../errors'
import { Adjustment, ExpectedResultIndicator } from '../entities'
import { AdjustmentDto } from '../dtos/ajustment/adjustment.dto'
import { CreateAdjustmentDto } from '../dtos/ajustment'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateAdjustmentService {
  constructor(
    @InjectRepository(ExpectedResultIndicator)
    private readonly expectedResultIndicatorRepository: Repository<ExpectedResultIndicator>
  ) {}

  public async create(createAjustmentDto: CreateAdjustmentDto): Promise<AdjustmentDto> {
    const adjustment = await getConnection().transaction((manager) => {
      return this.createWithTransaction(createAjustmentDto, manager)
    })

    const adjustmentDto = AdjustmentDto.fromEntity(adjustment)

    return adjustmentDto
  }

  public async createWithTransaction(createAjustmentDto: CreateAdjustmentDto, manager: EntityManager): Promise<Adjustment> {
    const expectedResultIndicator = await this.findExpectedResultById(createAjustmentDto.expectedResultIndicatorId)
    const adjustment = this.buildAdjustmentEntity(createAjustmentDto, expectedResultIndicator)
    const savedAdjustment = await manager.save(adjustment)
    return savedAdjustment
  }

  private async findExpectedResultById(expectedResultIndicatorId: string): Promise<ExpectedResultIndicator> {
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

  private buildAdjustmentEntity(createAdjustmentDto: CreateAdjustmentDto, expectedResultIndicator: ExpectedResultIndicator): Adjustment {
    const adjustment = new Adjustment()

    adjustment.problem = createAdjustmentDto.problem
    adjustment.suggestion = createAdjustmentDto.suggestion
    adjustment.type = createAdjustmentDto.type
    adjustment.expectedResultIndicator = expectedResultIndicator

    return adjustment
  }
}
