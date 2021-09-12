import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateModelDto } from '@modules/model/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'
import { ModelDto } from '../../shared/dtos/model/model.dto'

@Injectable()
export class CreateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}
  public async create(createModelDto: CreateModelDto): Promise<ModelDto> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.createWithManager(createModelDto, manager)
    })
  }

  public async createWithManager(createModelDto: CreateModelDto, manager: EntityManager): Promise<ModelDto> {
    await this.checkModelConflicts(createModelDto)
    const model = this.buildModel(createModelDto)
    const savedModel = await manager.save(model)
    const modelDto = this.mapToDto(savedModel)

    return modelDto
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

  private buildModel(createModelDto: CreateModelDto): Model {
    const model = CreateModelDto.toEntity(createModelDto)
    return model
  }

  private mapToDto(model: Model): ModelDto {
    const modelDto = ModelDto.fromEntity(model)
    return modelDto
  }
}
