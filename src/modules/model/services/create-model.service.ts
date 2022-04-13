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
import { ModelLevelNotFoundError } from '../errors/model-level.errors'

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
    const model = await getConnection().transaction((manager: EntityManager) => {
      return this.createWithManager(createModelDto, userId, manager)
    })

    return ModelDto.fromEntity(model)
  }

  public async createWithManager(
    createModelDto: CreateModelDto,
    userId: string,
    manager: EntityManager
  ): Promise<Model> {
    this.setManager(manager)

    const modelManager = await this.findModelManagerById(userId)
    await this.checkModelConflicts(createModelDto)
    const model = await this.createModel(createModelDto, modelManager)

    if (createModelDto?.modelLevels?.length) {
      await this.createModelLevel(createModelDto.modelLevels, model)
    }

    const modelWithLevels = await this.findFullModelById(model.id)

    if (createModelDto?.modelProcesses?.length) {
      await this.createModelProcesses(createModelDto.modelProcesses, modelWithLevels)
    }

    const savedModel = await this.findFullModelById(model.id)

    this.cleanManager()

    return savedModel
  }

  private async findFullModelById(modelId: string): Promise<Model> {
    const model = await this.manager
      .createQueryBuilder(Model, 'model')
      .leftJoinAndSelect('model.modelLevels', 'modelLevel')
      .leftJoinAndSelect('model.modelProcesses', 'modelProcess')
      .leftJoinAndSelect('modelProcess.expectedResults', 'expectedResult')
      .leftJoinAndSelect('expectedResult.maxLevel', 'maxLevel')
      .leftJoinAndSelect('expectedResult.minLevel', 'minLevel')
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
    modelProcess.type = createModelProcessDto.type
    modelProcess.model = model

    if (createModelProcessDto?.expectedResults?.length) {
      modelProcess.expectedResults = this.createExpectedResults(createModelProcessDto.expectedResults, model)
    }

    return modelProcess
  }

  private createExpectedResults(
    createExpectedResultDtos: CreateExpectedResultDto[],
    model: Model
  ): ExpectedResult[] {
    const expectedResultsToCreate = createExpectedResultDtos.map((createExpectedResultDto) => {
      return this.buildExpectedResultEntity(createExpectedResultDto, model)
    })

    return expectedResultsToCreate
  }

  private buildExpectedResultEntity(
    createExpectedResultDto: CreateExpectedResultDto,
    model: Model
  ): ExpectedResult {
    const maxLevel =
      createExpectedResultDto.maxLevel && this.getModelLevelByInitial(model, createExpectedResultDto.maxLevel)
    const minLevel = this.getModelLevelByInitial(model, createExpectedResultDto.minLevel)
    const expectedResult = new ExpectedResult()

    expectedResult.initial = createExpectedResultDto.initial
    expectedResult.name = createExpectedResultDto.name
    expectedResult.description = createExpectedResultDto.description
    expectedResult.maxLevel = maxLevel
    expectedResult.minLevel = minLevel

    return expectedResult
  }

  private getModelLevelByInitial(model: Model, initial: string): ModelLevel {
    const modelLevel = model?.modelLevels?.find((modelLevel) => modelLevel.initial === initial)

    if (!modelLevel) {
      throw new ModelLevelNotFoundError()
    }

    return modelLevel
  }

  private buildModelEntity(createModelDto: CreateModelDto, modelManager: ModelManager): Model {
    const model = new Model()

    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description
    model.modelManager = modelManager

    return model
  }
}
