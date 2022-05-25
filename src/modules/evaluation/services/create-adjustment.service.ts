import { CreateAdjustmentDto } from '@modules/evaluation/dtos/ajustment'
import { ExpectedResultAlreadyExistsError, ExpectedResultNotFoundError } from '@modules/model/errors'
import { Adjustment, Evaluation } from '@modules/evaluation/entities'
import { EvaluationNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { AdjustmentDto } from '@modules/evaluation/dtos/entities'
import { ExpectedResult } from '@modules/model/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateAdjustmentService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ExpectedResult)
    private readonly expectedResultRepository: Repository<ExpectedResult>
  ) {}

  public async create(createAjustmentDto: CreateAdjustmentDto): Promise<AdjustmentDto> {
    const adjustment = await getConnection().transaction((manager) => {
      return this.createWithTransaction(createAjustmentDto, manager)
    })

    const adjustmentDto = AdjustmentDto.fromEntity(adjustment)
    return adjustmentDto
  }

  public async createWithTransaction(createAjustmentDto: CreateAdjustmentDto, manager: EntityManager): Promise<Adjustment> {
    const expectedResult = await this.findExpectedResultById(createAjustmentDto.expectedResultId)
    const evaluation = await this.findEvaluationById(createAjustmentDto.evaluationId)
    const adjustment = this.buildAdjustmentEntity(createAjustmentDto, expectedResult, evaluation)
    const savedAdjustment = await manager.save(adjustment)

    return savedAdjustment
  }

  private async findExpectedResultById(expectedResuultId: string): Promise<ExpectedResult> {
    const expectedResult = await this.expectedResultRepository
      .createQueryBuilder('expectedResult')
      .where('expectedResult.id = :expectedResuultId')
      .setParameters({ expectedResuultId })
      .getOne()

    if (!expectedResult) {
      throw new ExpectedResultNotFoundError('Resultado esperado não encontrado.')
    }

    return expectedResult
  }

  private async findEvaluationById(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .where('evaluation.id = :evaluationId')
      .setParameters({ evaluationId })
      .getOne()

    if (!evaluation) {
      throw new EvaluationNotFoundError('Avaliação não encontrada')
    }

    return evaluation
  }

  private buildAdjustmentEntity(
    createAdjustmentDto: CreateAdjustmentDto,
    expectedResult: ExpectedResult,
    evaluation: Evaluation
  ): Adjustment {
    const adjustment = new Adjustment()

    adjustment.problem = createAdjustmentDto.problem
    adjustment.suggestion = createAdjustmentDto.suggestion
    adjustment.type = createAdjustmentDto.type
    adjustment.expectedResult = expectedResult
    adjustment.evaluation = evaluation

    return adjustment
  }
}
