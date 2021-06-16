import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'
import { CreateModelDto } from '../dto/create-model.dto'
import { Model } from '../entities'
import { ModelNameAlreadyExistsError } from '../errors/model-name-already-exists.error'

@Injectable()
export class CreateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}
  async createWithTransaction(
    createModelDto: CreateModelDto,
    manager: EntityManager
  ): Promise<Model> {
    await this.checkModelNameExists(createModelDto.name)
    const model = Model.createModel(createModelDto)

    return await manager.save(model)
  }
  async create(createModelDto: CreateModelDto): Promise<Model> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.createWithTransaction(createModelDto, manager)
    })
  }

  private async checkModelNameExists(name: string): Promise<void> {
    const model = await this.modelRepository.findOne({
      where: { name }
    })
    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }
}
