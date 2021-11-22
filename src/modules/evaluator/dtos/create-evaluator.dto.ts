import {
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateNested,
  IsUUID
} from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { CreateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { v4 } from 'uuid'
import { cleanNonNumberTransformer } from '@modules/shared/transformers'

export class CreateEvaluatorDto {
  @ApiProperty({ example: 'Lucas' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'luckmfv@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({ example: '07190909974' })
  @IsNotEmpty()
  @IsString()
  @Transform(cleanNonNumberTransformer)
  @Validate(DocumentNumberValidator)
  documentNumber: string

  @ApiProperty({ example: DocumentTypeEnum.F })
  @IsNotEmpty()
  @IsString()
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum

  @ApiProperty({ example: '41987308948' })
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty({ example: 'dificil123' })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ example: v4() })
  @IsNotEmpty()
  @IsUUID('4')
  evaluatorInstitutionId: string

  @ApiProperty({ type: () => [CreateEvaluatorLicenseDto] })
  @Type(() => CreateEvaluatorLicenseDto)
  @ValidateNested()
  @ArrayNotEmpty()
  licenses: CreateEvaluatorLicenseDto[]
}
