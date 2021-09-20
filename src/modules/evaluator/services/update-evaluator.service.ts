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
  private manager: EntityManager
  private setManager(manager: EntityManager): void {
    this.manager = manager
  }

  private cleanManager(): void {
    this.manager = null
  }

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
    this.setManager(manager)

    const evaluator = await this.findEvaluatorById(updateEvaluatorDto.id)
    const evaluatorToUpdate = this.updateEvaluatorData(evaluator, updateEvaluatorDto)
    await this.manager.save(evaluatorToUpdate)
    await this.createOrUpdateEvaluatorLicenses(updateEvaluatorDto)
    const fullEvaluator = await this.findFullEvaluator(updateEvaluatorDto.id)

    this.cleanManager()
    return fullEvaluator
  }

  private async findEvaluatorById(evaluatorId: string): Promise<Evaluator> {
    const evaluator = await this.manager.findOne(Evaluator, { where: { id: evaluatorId }, relations: ['commonEntity'] })

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

  private async createOrUpdateEvaluatorLicenses(updateEvaluatorDto: UpdateEvaluatorDto): Promise<void> {
    const promises = updateEvaluatorDto?.licenses.map((licenseDto) => {
      if (licenseDto.id) {
        return this.updateEvaluatorLicenseService.updateWithTransaction(licenseDto, this.manager)
      }
      return this.createEvaluatorLicenseService.createWithTransaction(licenseDto, updateEvaluatorDto.id, this.manager)
    })

    if (promises?.length) {
      await Promise.all(promises)
    }
  }

  private async findFullEvaluator(evaluatorId: string): Promise<Evaluator> {
    const evaluator = await this.manager.getCustomRepository(EvaluatorRepository).findFullEvaluatorById(evaluatorId)

    return evaluator
  }
}
