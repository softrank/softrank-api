import { AjustmentTypeEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateAdjustmentDto {
  constructor(createAjustmentDto?: CreateAdjustmentDto) {
    if (createAjustmentDto) {
      this.expectedResultIndicatorId = createAjustmentDto.expectedResultIndicatorId
      this.problem = createAjustmentDto.problem
      this.suggestion = createAjustmentDto.suggestion
    }
  }

  @ApiProperty({ example: 'Adicionar seção.' })
  @IsString()
  @IsNotEmpty()
  suggestion: string

  @ApiProperty({ example: 'Seção não encontrada.' })
  @IsString()
  @IsNotEmpty()
  problem: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  expectedResultIndicatorId: string

  @ApiProperty({ example: AjustmentTypeEnum.REQUIRED })
  @IsNotEmpty()
  @IsEnum(AjustmentTypeEnum)
  type: AjustmentTypeEnum
}
