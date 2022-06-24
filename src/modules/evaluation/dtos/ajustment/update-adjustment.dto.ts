import { IsString, IsEnum, IsOptional } from 'class-validator'
import { AjustmentTypeEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAdjustmentDto {
  constructor(updateAdjustmentDto: UpdateAdjustmentDto, public readonly adjustmentId: string = '') {
    if (updateAdjustmentDto) {
      this.resolution = updateAdjustmentDto.resolution
      this.problem = updateAdjustmentDto.problem
      this.suggestion = updateAdjustmentDto.suggestion
      this.type = updateAdjustmentDto.type
    }
  }

  @ApiProperty({ example: 'Adicionar seção.' })
  @IsString()
  @IsOptional()
  suggestion: string

  @ApiProperty({ example: 'Seção não encontrada.' })
  @IsString()
  @IsOptional()
  problem: string

  @ApiProperty({ example: AjustmentTypeEnum.REQUIRED })
  @IsOptional()
  @IsEnum(AjustmentTypeEnum)
  type: AjustmentTypeEnum

  @ApiProperty({ example: 'Foi feito assim.' })
  @IsString()
  @IsOptional()
  resolution: string
}
