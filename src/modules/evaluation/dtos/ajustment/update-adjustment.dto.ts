import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator'
import { AjustmentTypeEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAdjustmentDto {
  constructor(updateAdjustmentDto: UpdateAdjustmentDto, public readonly adjustmentId: string = '') {
    if (updateAdjustmentDto) {
      this.implemented = updateAdjustmentDto.implemented
      this.problem = updateAdjustmentDto.problem
      this.suggestion = updateAdjustmentDto.suggestion
      this.type = updateAdjustmentDto.type
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

  @ApiProperty({ example: AjustmentTypeEnum.REQUIRED })
  @IsNotEmpty()
  @IsEnum(AjustmentTypeEnum)
  type: AjustmentTypeEnum

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  implemented: boolean
}
