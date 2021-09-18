import { CleanNonNumbersTransformer } from '@shared/transformers'
import { EntityEntity } from '@modules/entity/entities'
import { DocumentTypeEnum } from '@shared/enums'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate
} from 'class-validator'
import {
  PhoneValidator,
  CpfValidator,
  PasswordValidator
} from '@shared/validators'

export class CreateEvaluatorDto {
  @ApiProperty({
    example: 'João BMW'
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'emailTeste@testeEmail.com'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    example: '(12) 3 3218-9321'
  })
  @IsString()
  @IsNotEmpty()
  @Validate(PhoneValidator)
  @Transform(CleanNonNumbersTransformer)
  phone: string

  @ApiProperty({
    example: '220.746.310-90'
  })
  @IsString()
  @IsNotEmpty()
  @Validate(CpfValidator)
  @Transform(CleanNonNumbersTransformer)
  documentNumber: string

  @ApiProperty({
    example: DocumentTypeEnum.CPF
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum

  @ApiProperty({
    example: 'dificil123'
  })
  @IsString()
  @IsNotEmpty()
  @Validate(PasswordValidator)
  password: string

  static toEntity(createEvaluatorDto: CreateEvaluatorDto): EntityEntity {
    const entity = new EntityEntity()

    entity.documentNumber = createEvaluatorDto.documentNumber
    entity.documentType = createEvaluatorDto.documentType
    entity.email = createEvaluatorDto.email
    entity.name = createEvaluatorDto.name
    entity.phone = createEvaluatorDto.phone

    return entity
  }
}
