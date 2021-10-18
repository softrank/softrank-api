import { DocumentTypeEnum } from '@modules/shared/enums'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Validate, IsEnum } from 'class-validator'

export class CreateAuditorBodyDto {
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

export class CreateAuditorDto extends CreateAuditorBodyDto {
  constructor(userId: string, createAuditorBodyDto: CreateAuditorBodyDto) {
    super()
    this.userId = userId
    this.documentNumber = createAuditorBodyDto.documentNumber
    this.documentType = createAuditorBodyDto.documentType
    this.email = createAuditorBodyDto.email
    this.name = createAuditorBodyDto.name
    this.phone = createAuditorBodyDto.phone
  }

  userId: string
}
