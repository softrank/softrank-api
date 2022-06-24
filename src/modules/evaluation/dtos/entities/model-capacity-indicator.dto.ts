import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { ModelCapacityIndicatorStatusEnum } from '@modules/evaluation/enums'
import { IndicatorDto } from './indicator.dto'

export class ModelCapacityIndicatorDto {
  id: string
  status: ModelCapacityIndicatorStatusEnum
  modelCapacityId: string
  name: string
  indicators: IndicatorDto[]

  static fromEntity(modelCapacityIndcator: ModelCapacityIndicator): ModelCapacityIndicatorDto {
    const { indicators, modelCapacity } = modelCapacityIndcator
    const modelCapacityIndicatorDto = new ModelCapacityIndicatorDto()

    modelCapacityIndicatorDto.id = modelCapacityIndcator.id
    modelCapacityIndicatorDto.status = modelCapacityIndcator.status

    if (modelCapacity) {
      modelCapacityIndicatorDto.name = modelCapacity.name
      modelCapacityIndicatorDto.modelCapacityId = modelCapacity.id
    }

    if (indicators) {
      modelCapacityIndicatorDto.indicators = IndicatorDto.fromManyEntities(indicators)
    }

    return modelCapacityIndicatorDto
  }

  static fromManyEntities(modelCapacitiesIndicators: ModelCapacityIndicator[]): ModelCapacityIndicatorDto[] {
    const modelCapacitiesIndicatorsDtos = modelCapacitiesIndicators?.map(ModelCapacityIndicatorDto.fromEntity)
    return modelCapacitiesIndicatorsDtos || []
  }
}
