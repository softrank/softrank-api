import { IsDateString, IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { ModelLevel } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'
import { v4 } from 'uuid'
import { EvaluatorLicenseType } from '@modules/evaluator/enums'

export class CreateEvaluatorLicenseDto {
  @ApiProperty({ example: stringDate() })
  @IsDateString({ strict: true })
  @IsNotEmpty()
  expiration: Date

  @ApiProperty({ example: EvaluatorLicenseType.LEADER })
  @IsNotEmpty()
  @IsEnum(EvaluatorLicenseType)
  type: EvaluatorLicenseType

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  modelLevelId: string

  static toEntity(createEvaluatorLicenseDto: CreateEvaluatorLicenseDto, modelLevel: ModelLevel): EvaluatorLicense {
    const entity = new EvaluatorLicense()

    entity.expiration = createEvaluatorLicenseDto.expiration
    entity.isActive = true
    entity.modelLevel = modelLevel
    entity.type = createEvaluatorLicenseDto.type

    return entity
  }
}
