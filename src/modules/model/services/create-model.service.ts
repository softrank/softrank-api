import { ModelManagerNotFoundError, ModelNameAlreadyExistsError } from '@modules/model/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateModelDto } from '@modules/model/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelDto } from '../../shared/dtos/model/model.dto'
import { ModelManager } from '../entities/model-manager.entity'
import { ManagedService } from '../../shared/services/managed.service'
import { CreateModelLevelDto } from '../dtos/create-model-level.dto'
import { ModelLevel } from '../entities/model-level.entity'
import { CreateModelProcessDto } from '../dtos/create-model-process.dto'
import { ModelProcess } from '../entities/model-process.entity'
import { CreateExpectedResultDto } from '../dtos/create-expected-result.dto'
import { ExpectedResult } from '../entities/expected-result.entity'
import { ModelNotFoundError } from '../errors/model-not-found.error'

@Injectable()
export class CreateModelService extends ManagedService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(ModelManager)
    private readonly modelManagerRepository: Repository<ModelManager>
  ) {
    super()
  }

  public async create(createModelDto: CreateModelDto, userId: string): Promise<ModelDto> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.createWithManager(createModelDto, userId, manager)
    })
  }

  public async createWithManager(
    createModelDto: CreateModelDto,
    userId: string,
    manager: EntityManager
  ): Promise<ModelDto> {
    this.setManager(manager)
    const modelManager = await this.findModelManagerById(userId)
    await this.checkModelConflicts(createModelDto)
    const model = await this.createModel(createModelDto, modelManager)

    if (createModelDto?.modelLevels?.length) {
      await this.createModelLevel(createModelDto.modelLevels, model)
    }

    if (createModelDto?.modelProcesses?.length) {
      await this.createModelProcesses(createModelDto.modelProcesses, model)
    }

    const savedModel = await this.findFullModelById(model.id)
    const modelDto = this.mapToDto(savedModel)

    this.cleanManager()

    return modelDto
  }

  private async findFullModelById(modelId: string): Promise<Model> {
    const model = await this.manager
      .createQueryBuilder(Model, 'model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .leftJoinAndSelect('model.modelProcesses', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .where('model.id = :modelId', { modelId })
      .getOne()

    if (!model) {
      throw new ModelNotFoundError()
    }

    return model
  }

  private async findModelManagerById(modelManagerId: string): Promise<ModelManager> {
    const modelManager = await this.modelManagerRepository.findOne({
      where: { id: modelManagerId }
    })

    if (!modelManager) {
      throw new ModelManagerNotFoundError()
    }

    return modelManager
  }

  private async checkModelConflicts({ name, year }: CreateModelDto): Promise<void> {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .where('model.name = :name', { name })
      .where('model.year = :year::timestamp', { year })
      .getOne()

    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private async createModel(createModelDto: CreateModelDto, modelManager: ModelManager): Promise<Model> {
    const modelToCreate = this.buildModelEntity(createModelDto, modelManager)
    const createdModel = await this.manager.save(modelToCreate)

    return createdModel
  }

  private async createModelLevel(createModelLevelDtos: CreateModelLevelDto[], model: Model): Promise<void> {
    const modelLevelsToCreate = createModelLevelDtos.map((createModelLevelDto) =>
      this.buildModelLevelEntity(createModelLevelDto, model)
    )

    await this.manager.save(modelLevelsToCreate)
  }

  private buildModelLevelEntity(createModelLevelDto: CreateModelLevelDto, model: Model): ModelLevel {
    const modelLevel = new ModelLevel()

    modelLevel.initial = createModelLevelDto.initial
    modelLevel.name = createModelLevelDto.name
    modelLevel.predecessor = createModelLevelDto.predecessor
    modelLevel.model = model

    return modelLevel
  }

  private async createModelProcesses(
    createModelProcessDtos: CreateModelProcessDto[],
    model: Model
  ): Promise<void> {
    const modelProcessesToCreate = createModelProcessDtos.map((createModelProcessDto) => {
      return this.buildModelProcessEntity(createModelProcessDto, model)
    })

    await this.manager.save(modelProcessesToCreate)
  }

  private buildModelProcessEntity(createModelProcessDto: CreateModelProcessDto, model: Model): ModelProcess {
    const modelProcess = new ModelProcess()

    modelProcess.initial = createModelProcessDto.initial
    modelProcess.name = createModelProcessDto.name
    modelProcess.description = createModelProcessDto.description
    modelProcess.model = model

    if (createModelProcessDto?.expectedResults?.length) {
      modelProcess.expectedResults = this.createExpectedResults(createModelProcessDto.expectedResults)
    }

    return modelProcess
  }

  private createExpectedResults(createExpectedResultDtos: CreateExpectedResultDto[]): ExpectedResult[] {
    const expectedResultsToCreate = createExpectedResultDtos.map((createExpectedResultDto) => {
      return this.buildExpectedResultEntity(createExpectedResultDto)
    })

    return expectedResultsToCreate
  }

  private buildExpectedResultEntity(createExpectedResultDto: CreateExpectedResultDto): ExpectedResult {
    const expectedResult = new ExpectedResult()

    expectedResult.initial = createExpectedResultDto.initial
    expectedResult.name = createExpectedResultDto.name
    expectedResult.description = createExpectedResultDto.description
    expectedResult.maxLevel = createExpectedResultDto.maxLevel
    expectedResult.minLevel = createExpectedResultDto.minLevel

    return expectedResult
  }

  private buildModelEntity(createModelDto: CreateModelDto, modelManager: ModelManager): Model {
    const model = new Model()

    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description
    model.modelManager = modelManager

    return model
  }

  private mapToDto(model: Model): ModelDto {
    const modelDto = ModelDto.fromEntity(model)
    return modelDto
  }
}
