import { EntityRepository } from '@modules/entity/repositories'
import { EvaluatorNotFoundError } from '@modules/entity/errors'
import { EntityEntity } from '@modules/entity/entities'
import { EvaluatorDto } from '@modules/entity/dtos'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GetEvaluatorService {
  constructor(private readonly entityRepository: EntityRepository) {}
  async getById(id: string): Promise<EvaluatorDto> {
    const evaluator = await this.findEvaluatorById(id)
    return this.mapToDto(evaluator)
  }

  async me(userId: string): Promise<EvaluatorDto> {
    const evaluator = await this.findEvaluatorByUserId(userId)
    return this.mapToDto(evaluator)
  }

  private async findEvaluatorById(id: string): Promise<EntityEntity> {
    const evaluator = await this.entityRepository.findById(id)

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }

  private async findEvaluatorByUserId(userId: string): Promise<EntityEntity> {
    const evaluator = await this.entityRepository.findByUserId(userId)

    if (!evaluator) {
      throw new EvaluatorNotFoundError()
    }

    return evaluator
  }

  private mapToDto(evaluator: EntityEntity): EvaluatorDto {
    return EvaluatorDto.fromEntity(evaluator)
  }
}
