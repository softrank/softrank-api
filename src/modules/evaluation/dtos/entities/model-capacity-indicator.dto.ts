import { ModelCapacityIndicator } from '@modules/evaluation/entities'
import { ModelCapacityIndicatorStatusEnum } from '@modules/evaluation/enums'
import { ModelCapacityTypeEnum } from '@modules/model/enum'
import { IndicatorDto } from './indicator.dto'
import { TargetAvaliationDto } from './target-avaliation.dto'

export class ModelCapacityIndicatorDto {
  id: string
  status: ModelCapacityIndicatorStatusEnum
  modelCapacityId: string
  name: string
  type: ModelCapacityTypeEnum
  indicators: IndicatorDto[]
  projectAvaliations: TargetAvaliationDto[]
  modelProcessAvaliations: TargetAvaliationDto[]
  avaliations: TargetAvaliationDto[]

  static fromEntity(modelCapacityIndcator: ModelCapacityIndicator): ModelCapacityIndicatorDto {
    const { indicators, modelCapacity, targetAvaliations } = modelCapacityIndcator
    const modelCapacityIndicatorDto = new ModelCapacityIndicatorDto()

    modelCapacityIndicatorDto.id = modelCapacityIndcator.id
    modelCapacityIndicatorDto.status = modelCapacityIndcator.status

    if (modelCapacity) {
      modelCapacityIndicatorDto.name = modelCapacity.name
      modelCapacityIndicatorDto.modelCapacityId = modelCapacity.id
      modelCapacityIndicatorDto.type = modelCapacity.type
    }

    if (indicators) {
      modelCapacityIndicatorDto.indicators = IndicatorDto.fromManyEntities(indicators)
    }

    if (targetAvaliations) {
      if (modelCapacity?.type === ModelCapacityTypeEnum.ORGANIZATIONAL) {
        modelCapacityIndicatorDto.modelProcessAvaliations = TargetAvaliationDto.fromManyEntities(targetAvaliations)
      } else if (modelCapacity?.type === ModelCapacityTypeEnum.PROJECT) {
        modelCapacityIndicatorDto.projectAvaliations = TargetAvaliationDto.fromManyEntities(targetAvaliations)
      } else {
        modelCapacityIndicatorDto.avaliations = TargetAvaliationDto.fromManyEntities(targetAvaliations)
      }
    }

    return modelCapacityIndicatorDto
  }

  static fromManyEntities(modelCapacitiesIndicators: ModelCapacityIndicator[]): ModelCapacityIndicatorDto[] {
    const modelCapacitiesIndicatorsDtos = modelCapacitiesIndicators?.map(ModelCapacityIndicatorDto.fromEntity)
    return modelCapacitiesIndicatorsDtos || []
  }
}
