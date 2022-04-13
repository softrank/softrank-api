import { CreateEvaluatorLicenseService, UpdateEvaluatorLicenseService } from '@modules/evaluator/services'
import { EvaluatorRepository } from '@modules/evaluator/repositories'
import { EvaluatorNotFoundError } from '@modules/evaluator/errors'
import { EvaluatorDto } from '@modules/shared/dtos/evaluator'
import { UpdateEvaluatorDto } from '@modules/evaluator/dtos'
import { Evaluator } from '@modules/evaluator/entities'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateEvaluatorService {
  constructor(
    private readonly createEvaluatorLicenseService: CreateEvaluatorLicenseService,
    private readonly updateEvaluatorLicenseService: UpdateEvaluatorLicenseService
  ) {}
  public async update(updateEvaluatorDto: UpdateEvaluatorDto): Promise<EvaluatorDto> {
    const updatedEvaluator = await getConnection().transaction((manager: EntityManager) => {
      return this.updateWithTransaction(updateEvaluatorDto, manager)
    })

    return EvaluatorDto.fromEntity(updatedEvaluator)
  }

  public async updateWithTransaction(
    updateEvaluatorDto: UpdateEvaluatorDto,
    manager: EntityManager
  ): Promise<Evaluator> {
    const evaluator = await this.findEvaluatorById(updateEvaluatorDto.id, manager)
    const evaluatorToUpdate = this.updateEvaluatorData(evaluator, updateEvaluatorDto)
    await manager.save(evaluatorToUpdate)
    await this.createOrUpdateEvaluatorLicenses(updateEvaluatorDto, manager)
    const fullEvaluator = await this.findFullEvaluator(updateEvaluatorDto.id, manager)

    return fullEvaluator
  }

  private async findEvaluatorById(evaluatorId: string, manager: EntityManager): Promise<Evaluator> {
    const evaluator = await manager.findOne(Evaluator, {
      where: { id: evaluatorId },
      relations: ['commonEntity']
    })

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }

  private updateEvaluatorData(evaluator: Evaluator, updateEvaluatorDto: UpdateEvaluatorDto): Evaluator {
    evaluator.commonEntity.name = updateEvaluatorDto.name
    evaluator.commonEntity.phone = updateEvaluatorDto.phone

    return evaluator
  }

  private async createOrUpdateEvaluatorLicenses(
    updateEvaluatorDto: UpdateEvaluatorDto,
    manager: EntityManager
  ): Promise<void> {
    const promises = updateEvaluatorDto?.licenses.map((licenseDto) => {
      if (licenseDto.id) {
        return this.updateEvaluatorLicenseService.updateWithTransaction(licenseDto, manager)
      }
      return this.createEvaluatorLicenseService.createWithTransaction(
        licenseDto,
        updateEvaluatorDto.id,
        manager
      )
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async findFullEvaluator(evaluatorId: string, manager: EntityManager): Promise<Evaluator> {
    const evaluator = await manager
      .getCustomRepository(EvaluatorRepository)
      .findFullEvaluatorById(evaluatorId)

    return evaluator
  }
}
