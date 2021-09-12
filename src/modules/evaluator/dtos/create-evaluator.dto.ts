import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsString, Validate, ValidateNested } from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { CreateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

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

  @ApiProperty({ type: () => [CreateEvaluatorLicenseDto] })
  @Type(() => CreateEvaluatorLicenseDto)
  @ValidateNested()
  @ArrayNotEmpty()
  licenses: CreateEvaluatorLicenseDto[]
}
