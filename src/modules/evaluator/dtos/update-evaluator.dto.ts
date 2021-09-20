import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { UpdateEvaluatorLicenseDto } from '@modules/evaluator/dtos'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class UpdateEvaluatorBodyDto {
  @ApiProperty({ example: 'Lucas' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: '41987308948' })
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty({ type: () => [UpdateEvaluatorLicenseDto] })
  @Type(() => UpdateEvaluatorLicenseDto)
  @ValidateNested()
  @ArrayNotEmpty()
  licenses: UpdateEvaluatorLicenseDto[]
}

export class UpdateEvaluatorDto extends UpdateEvaluatorBodyDto {
  constructor(id: string, updateEvaluatorBodyDto: UpdateEvaluatorBodyDto) {
    super()

    this.id = id
    this.name = updateEvaluatorBodyDto.name
    this.phone = updateEvaluatorBodyDto.phone
    this.licenses = updateEvaluatorBodyDto.licenses
  }

  id: string
}
