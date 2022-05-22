import { AjustmentTypeEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateAdjustmentDto {
  constructor(createAjustmentDto?: CreateAdjustmentDto) {
    if (createAjustmentDto) {
      this.expectedResultIndicatorId = createAjustmentDto.expectedResultIndicatorId
      this.problem = createAjustmentDto.problem
      this.sugestion = createAjustmentDto.sugestion
    }
  }

  @ApiProperty({ example: 'Adicionar seção.' })
  @IsString()
  @IsNotEmpty()
  sugestion: string

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
