import { IsNotEmpty, IsString, Validate, IsEnum } from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'

export class CreateModelManagerBodyDto {
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
}

export class CreateModelManagerDto extends CreateModelManagerBodyDto {
  constructor(userId: string, createModelManagerBodyDto: CreateModelManagerBodyDto) {
    super()

    this.userId = userId
    this.documentNumber = createModelManagerBodyDto.documentNumber
    this.documentType = createModelManagerBodyDto.documentType
    this.email = createModelManagerBodyDto.email
    this.name = createModelManagerBodyDto.name
    this.phone = createModelManagerBodyDto.phone
  }

  userId: string
}
