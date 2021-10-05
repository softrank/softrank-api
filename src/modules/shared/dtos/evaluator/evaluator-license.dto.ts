import { EvaluatorLicense } from '@modules/evaluator/entities'
import { ModelLevelDto } from '@modules/shared/dtos/model'

export class EvaluatorLicenseDto {
  id: string
  expiration: Date
  isActive: boolean
  modelLevel: ModelLevelDto

  static fromEntity(evaluatorLicense: EvaluatorLicense): EvaluatorLicenseDto {
    const dto = new EvaluatorLicenseDto()

    dto.id = evaluatorLicense.id
    dto.expiration = evaluatorLicense.expiration
    dto.isActive = evaluatorLicense.isActive
    dto.modelLevel = ModelLevelDto.fromEntity(evaluatorLicense.modelLevel)

    return dto
  }
}
