import { Model, ModelProcess, ModelLevel } from '@modules/model/entities'
import { EntityManager, getConnection, Repository, Not } from 'typeorm'
import { ModelNameAlreadyExistsError } from '@modules/model/errors'
import { UpdateModelDto } from '@modules/model/dtos'
import { ModelDto } from '@modules/shared/dtos/model'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(ModelLevel)
    private readonly modelLevelRepository: Repository<ModelLevel>,
    @InjectRepository(ModelProcess)
    private readonly modelProcessRepository: Repository<ModelProcess>
  ) {}
  async update(updateModelDto: UpdateModelDto): Promise<ModelDto> {
    return await getConnection().transaction(async (manager: EntityManager) => {
      return this.updateWithTransaction(updateModelDto, manager)
    })
  }

  async updateWithTransaction(updateModelDto: UpdateModelDto, manager: EntityManager): Promise<ModelDto> {
    await this.checkModelNameExists(updateModelDto)
    const model = this.updateModel(updateModelDto)
    const updatedModel = await manager.save(model)
    const modelDto = this.mapToDto(updatedModel)
    // Falar com o joão sobre o update

    return modelDto
  }

  private async checkModelNameExists({ id, name, year }: UpdateModelDto): Promise<void> {
    const model = await this.modelRepository.findOne({ where: { id: Not(id), name, year } })

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

  private mapToDto(model: Model): ModelDto {
    const modelDto = ModelDto.fromEntity(model)
    return modelDto
  }
}
