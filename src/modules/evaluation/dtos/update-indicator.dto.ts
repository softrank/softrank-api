import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateIndicatorBodyDto {
  @ApiProperty({ example: 'Planejamento do projeto' })
  @IsOptional()
  @IsString()
  content: string

  @ApiProperty()
  @IsOptional()
  @IsUUID('4', { each: true })
  projectIds: string[]
}

export class UpdateIndicatorDto extends UpdateIndicatorBodyDto {
  constructor(indicatorId: string, updateIndicatorBodyDto: UpdateIndicatorBodyDto) {
    super()

    this.content = updateIndicatorBodyDto.content
    this.projectIds = updateIndicatorBodyDto.projectIds
    this.indicatorId = indicatorId
  }

  indicatorId: string
}
