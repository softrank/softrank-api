import { DocumentTypeEnum } from '@modules/shared/enums'
import { cleanNonNumberTransformer } from '@modules/shared/transformers'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Validate, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateAuditorDto {
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
}
