import { IsDateString, IsNotEmpty, IsString } from 'class-validator'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { ModelLevel } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'
import { v4 } from 'uuid'

export class CreateEvaluatorLicenseDto {
  @ApiProperty({ example: stringDate() })
  @IsDateString()
  @IsNotEmpty()
  expiration: Date

  @ApiProperty({ example: v4() })
  @IsNotEmpty()
  @IsString()
  modelLevelId: string

  static toEntity(
    createEvaluatorLicenseDto: CreateEvaluatorLicenseDto,
    modelLevel: ModelLevel
  ): EvaluatorLicense {
    const entity = new EvaluatorLicense()

    entity.expiration = createEvaluatorLicenseDto.expiration
    entity.isActive = true
    entity.modelLevel = modelLevel

    return entity
  }
}
