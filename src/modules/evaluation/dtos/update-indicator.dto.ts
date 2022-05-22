import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateIndicatorBodyDto {
  @ApiProperty({ example: 'Planejamento do projeto' })
  @IsOptional()
  @IsString()
  content: string

  @ApiProperty({ example: 'Algum grupo' })
  @IsOptional()
  @IsString()
  qualityAssuranceGroup: string
}

export class UpdateIndicatorDto extends UpdateIndicatorBodyDto {
  constructor(indicatorId: string, updateIndicatorBodyDto: UpdateIndicatorBodyDto) {
    super()

    this.content = updateIndicatorBodyDto.content
    this.qualityAssuranceGroup = updateIndicatorBodyDto.qualityAssuranceGroup
    this.indicatorId = indicatorId
  }

  indicatorId: string
}
