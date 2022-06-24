import { ExpectedResultIndicatorDto } from '@modules/evaluation/dtos/entities'
import { ExpectedResultIndicator } from '@modules/evaluation/entities'
import { ExpectedResultIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ExpectedResultIndicatorNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class SetExpectedResultIndicatorStatusService {
  constructor(
    @InjectRepository(ExpectedResultIndicator)
    private readonly expectedResultIndicatorRepository: Repository<ExpectedResultIndicator>
  ) {}

  public async setStatus(
    expectedResultIndicatorId: string,
    status: ExpectedResultIndicatorStatusEnum
  ): Promise<ExpectedResultIndicatorDto> {
    const expectedResultIndicator = await getConnection().transaction((manager) => {
      return this.setStatusWithTransaction(expectedResultIndicatorId, status, manager)
    })

    const expectedResultIndicatorDto = ExpectedResultIndicatorDto.fromEntity(expectedResultIndicator)
    return expectedResultIndicatorDto
  }

  public async setStatusWithTransaction(
    expectedResultIndicatorId: string,
    status: ExpectedResultIndicatorStatusEnum,
    manager: EntityManager
  ): Promise<ExpectedResultIndicator> {
    const expectedResultIndicator = await this.findExpectedResultIndicatorById(expectedResultIndicatorId)
    this.updateExpectedResultIndicatorData(expectedResultIndicator, status)
    const updatedExpectedResultIndicator = await manager.save(expectedResultIndicator)

    return updatedExpectedResultIndicator
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

  private updateExpectedResultIndicatorData(
    expectedResultIndicator: ExpectedResultIndicator,
    stauts: ExpectedResultIndicatorStatusEnum
  ): void {
    expectedResultIndicator.status = stauts
  }
}
