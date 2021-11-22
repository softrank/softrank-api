import { IsNotEmpty, IsString, Validate, IsEnum, IsOptional } from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { cleanNonNumberTransformer } from '@modules/shared/transformers'

export class CreateOrganizationalUnitDto {
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

  @ApiProperty({ example: ['Projeto 1'] })
  @IsOptional()
  @IsString({ each: true })
  projects: string[]

  @ApiProperty({ example: 'dificil123' })
  @IsNotEmpty()
  @IsString()
  password: string
}
