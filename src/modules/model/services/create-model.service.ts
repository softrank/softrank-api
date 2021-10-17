import { ModelManagerNotFoundError, ModelNameAlreadyExistsError } from '@modules/model/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateModelDto } from '@modules/model/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelDto } from '../../shared/dtos/model/model.dto'
import { ModelManager } from '../entities/model-manager.entity'

@Injectable()
export class CreateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(ModelManager)
    private readonly modelManagerRepository: Repository<ModelManager>
  ) {}
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
    const modelManager = await this.findModelManagerById(userId)
    await this.checkModelConflicts(createModelDto)
    const model = this.buildModel(createModelDto, modelManager)
    const savedModel = await manager.save(model)
    const modelDto = this.mapToDto(savedModel)

    return modelDto
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

  private buildModel(createModelDto: CreateModelDto, modelManager: ModelManager): Model {
    const model = CreateModelDto.toEntity(createModelDto, modelManager)
    return model
  }

  private mapToDto(model: Model): ModelDto {
    const modelDto = ModelDto.fromEntity(model)
    return modelDto
  }
}
