import { ModelCapacity } from '@modules/model/entities'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { ModelDto } from './model.dto'

export class ModelCapacityDto {
  id: string
  name: string
  type: ModelCapacityTypeEnum
  minLevel: string
  maxLevel: string
  model: ModelDto

  static fromEntity(modelCapacity: ModelCapacity): ModelCapacityDto {
    const modelCapacityDto = new ModelCapacityDto()

    modelCapacityDto.id = modelCapacity.id
    modelCapacityDto.name = modelCapacity.name
    modelCapacityDto.type = modelCapacity.type

    if (modelCapacity.minModelLevel) {
      modelCapacityDto.minLevel = modelCapacity.minModelLevel.initial
    }

    if (modelCapacity.maxModelLevel) {
      modelCapacityDto.maxLevel = modelCapacity.maxModelLevel.initial
    }

    if (modelCapacity.model) {
      modelCapacityDto.model = ModelDto.fromEntity(modelCapacity.model)
    }

    return modelCapacityDto
  }

  static fromManyEntities(modelCapacities: ModelCapacity[]): ModelCapacityDto[] {
    const modelCapacitiesDtos = modelCapacities?.map(ModelCapacityDto.fromEntity) || []
    return modelCapacitiesDtos
  }
}
