import { IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEvaluationModelProcessResultDto {
  @ApiProperty()
  @IsUUID('4')
  modelProcessId: string

  @ApiProperty()
  @IsUUID('4')
  expectedModelLevelId: string

  @ApiProperty({ example: 'Não avaliado' })
  @IsString()
  result: string
}
