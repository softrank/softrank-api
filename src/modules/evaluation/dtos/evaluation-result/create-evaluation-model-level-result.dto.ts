import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateEvaluationModelLevelResultDto {
  @ApiProperty()
  @IsUUID('4')
  modelLevelId: string

  @ApiProperty({ example: 'Não avaliado' })
  @IsString()
  result: string
}
