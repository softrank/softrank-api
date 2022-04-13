import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator'
import { EntityStatusEnum } from '@modules/shared/enums'
import { EvaluatorLicenseType } from '../enums'
import { ApiProperty } from '@nestjs/swagger'

export class FindEvaluatorQueryDto {
  @ApiProperty({ required: false, example: '07190909974' })
  @IsString()
  @IsOptional()
  search: string

  @ApiProperty({ required: false, example: EntityStatusEnum.PENDING, enum: EntityStatusEnum })
  @IsEnum(EntityStatusEnum)
  @IsOptional()
  status: EntityStatusEnum

  @ApiProperty({ required: false, example: EvaluatorLicenseType.ADJUNCT, enum: EvaluatorLicenseType })
  @IsEnum(EvaluatorLicenseType)
  @IsOptional()
  type: EvaluatorLicenseType

  @ApiProperty({ required: false })
  @IsUUID('4')
  @IsOptional()
  evaluationInstitutionId: string
}
