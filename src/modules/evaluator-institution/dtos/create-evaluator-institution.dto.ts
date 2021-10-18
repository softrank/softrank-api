import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsString, Validate, ValidateNested } from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'
import { makeFakeCnpj } from '@utils/helpers'
import { CreateEvaluatorInsitutionAddressDto } from './create-evaluator-institution-address.dto'
import { Type } from 'class-transformer'

export class CreateEvaluatorInstitutionDto {
  @ApiProperty({ example: 'Lucas' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'luckmfv@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({ example: makeFakeCnpj() })
  @IsNotEmpty()
  @IsString()
  @Validate(DocumentNumberValidator)
  documentNumber: string

  @ApiProperty({ example: DocumentTypeEnum.J })
  @IsNotEmpty()
  @IsString()
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum

  @ApiProperty({ example: '41987308948' })
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty({ type: () => CreateEvaluatorInsitutionAddressDto })
  @Type(() => CreateEvaluatorInsitutionAddressDto)
  @ValidateNested()
  @IsNotEmptyObject()
  address: CreateEvaluatorInsitutionAddressDto
}