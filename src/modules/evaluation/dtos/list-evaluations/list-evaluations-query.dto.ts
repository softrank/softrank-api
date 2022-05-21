import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListEvaluationsQueryDto {
  constructor(listEvaluationsQueryDto?: Partial<ListEvaluationsQueryDto>) {
    this.evaluatorId = listEvaluationsQueryDto?.evaluatorId
    this.modelManagerId = listEvaluationsQueryDto?.modelManagerId
    this.search = listEvaluationsQueryDto?.search
    this.limit = listEvaluationsQueryDto?.limit
    this.page = listEvaluationsQueryDto?.page
  }

  evaluatorId: string
  modelManagerId: string
  organizationalUnitId: string
  auditorId: string
  userId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  limit = '10'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  page = '1'
}
