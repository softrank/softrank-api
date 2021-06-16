import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateModelDto } from '../dto/create-model.dto'
import { Model } from '../entities'
import { ModelNameAlreadyExistsError } from '../errors/model-name-already-exists.error'
import { v4 } from 'uuid'

@Injectable()
export class CreateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}
  async create(createModelDto: CreateModelDto): Promise<Model> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.createWithTransaction(createModelDto, manager)
    })
  }

  async createWithTransaction(
    createModelDto: CreateModelDto,
    manager: EntityManager
  ): Promise<Model> {
    await this.checkModelNameExists(createModelDto.name)
    const model = this.createModel(createModelDto)

    return await manager.save(model)
  }

  private async checkModelNameExists(name: string): Promise<void> {
    const model = await this.modelRepository.findOne({
      where: { name }
    })
    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private createModel(createModelDto: CreateModelDto): Model {
    const model = new Model()

    model.id = v4()
    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description

    return model
  }
}
