import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { IndicatorDto } from './indicator.dto'

export class ModelCapacityIndicatorDto {
  id: string
  modelCapacityId: string
  name: string
  indicators: IndicatorDto[]

  static fromEntity(modelCapacityIndcator: ModelCapacityIndicator): ModelCapacityIndicatorDto {
    const { indicators, modelCapacity } = modelCapacityIndcator
    const modelCapacityIndicatorDto = new ModelCapacityIndicatorDto()

    modelCapacityIndicatorDto.id = modelCapacityIndcator.id

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
