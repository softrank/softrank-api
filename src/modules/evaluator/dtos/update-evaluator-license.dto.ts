import { IsDateString, IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'
import { v4 } from 'uuid'
import { EvaluatorLicenseType } from '../enums'

export class UpdateEvaluatorLicenseDto {
  @ApiProperty({ example: v4() })
  @IsUUID('4')
  @IsOptional()
  id: string

  @ApiProperty({ example: stringDate() })
  @IsDateString()
  @IsNotEmpty()
  expiration: Date

  @ApiProperty({ example: EvaluatorLicenseType.LEADER })
  @IsDateString()
  @IsEnum(EvaluatorLicenseType)
  type: EvaluatorLicenseType

  @ApiProperty({ example: v4() })
  @IsNotEmpty()
  @IsString()
  modelLevelId: string
}
