import { TargetAvaliation } from '@modules/evaluation/entities'
import { TargetAvaliationStatusEnum } from '@modules/evaluation/enums'

export class TargetAvaliationDto {
  id: string
  targetId: string
  status: TargetAvaliationStatusEnum

  static fromEntity(targetAvaluation: TargetAvaliation): TargetAvaliationDto {
    const targetAvaliationDto = new TargetAvaliationDto()

    targetAvaliationDto.id = targetAvaluation.id
    targetAvaliationDto.status = targetAvaluation.status
    targetAvaliationDto.targetId = targetAvaluation.targetId

    return targetAvaliationDto
  }

  static fromManyEntities(targetAvaluations: TargetAvaliation[]): TargetAvaliationDto[] {
    const targetAvaliationDtos = targetAvaluations?.map(TargetAvaliationDto.fromEntity)
    return targetAvaliationDtos || []
  }
}
