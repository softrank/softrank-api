import { IsNotEmpty, IsString, Validate, IsEnum } from 'class-validator'
import { DocumentNumberValidator } from '@modules/shared/validators'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrganizationalUnitBodyDto {
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

export class CreateOrganizationalUnitDto extends CreateOrganizationalUnitBodyDto {
  constructor(userId: string, createOrganizationalUnitBodyDto: CreateOrganizationalUnitBodyDto) {
    super()

    this.userId = userId
    this.documentNumber = createOrganizationalUnitBodyDto.documentNumber
    this.documentType = createOrganizationalUnitBodyDto.documentType
    this.email = createOrganizationalUnitBodyDto.email
    this.name = createOrganizationalUnitBodyDto.name
    this.phone = createOrganizationalUnitBodyDto.phone
  }

  userId: string
}
