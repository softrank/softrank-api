import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { EntityManager, getConnection, Repository, Not } from 'typeorm'
import { UpdateModelDto } from '@modules/model/dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@modules/model/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>
  ) {}
  async update(updateModelDto: UpdateModelDto): Promise<Model> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.updateWithTransaction(updateModelDto, manager)
    })
  }

  async updateWithTransaction(
    updateModelDto: UpdateModelDto,
    manager: EntityManager
  ): Promise<Model> {
    await this.checkModelNameExists(updateModelDto)
    const model = this.updateModel(updateModelDto)

    return await manager.save(model)
  }

  private async checkModelNameExists({
    id,
    name
  }: UpdateModelDto): Promise<void> {
    const model = await this.modelRepository.findOne({
      where: {
        id: Not(id),
        name
      }
    })
    if (model) {
      throw new ModelNameAlreadyExistsError()
    }
  }

  private updateModel(updateModelDto: UpdateModelDto): Model {
    const model = new Model()

    model.id = updateModelDto.id
    model.name = updateModelDto.name
    model.year = updateModelDto.year
    model.description = updateModelDto.description

    return model
  }
}
