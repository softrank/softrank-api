import { TargetAvaliation } from '@modules/evaluation/entities'
import { TargetAvaliationStatusEnum, TargetAvaliationTypeEnum } from '@modules/evaluation/enums'

export class TargetAvaliationDto {
  id: string
  targetId: string
  status: TargetAvaliationStatusEnum
  projectId: string
  modelProcessId: string

  static fromEntity(targetAvaluation: TargetAvaliation): TargetAvaliationDto {
    const targetAvaliationDto = new TargetAvaliationDto()

    targetAvaliationDto.id = targetAvaluation.id
    targetAvaliationDto.status = targetAvaluation.status
    targetAvaliationDto.targetId = targetAvaluation.targetId

    if (targetAvaluation.targetType === TargetAvaliationTypeEnum.EVALUATION_PROJECT) {
      targetAvaliationDto.projectId = targetAvaluation.targetId
    }

    if (targetAvaluation.targetType === TargetAvaliationTypeEnum.MODEL_PROCESS) {
      targetAvaliationDto.modelProcessId = targetAvaluation.targetId
    }

    return targetAvaliationDto
  }

  static fromManyEntities(targetAvaluations: TargetAvaliation[]): TargetAvaliationDto[] {
    const targetAvaliationDtos = targetAvaluations?.map(TargetAvaliationDto.fromEntity)
    return targetAvaliationDtos || []
  }
}
