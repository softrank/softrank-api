import { TargetAvaliationStatusEnum } from '@modules/evaluation/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

export class SetExpectedResultIndicatorProjectAvaliationDto {
  @ApiProperty()
  @IsUUID('4')
  evaluationProjectId: string

  @ApiProperty({ example: TargetAvaliationStatusEnum.PARCIALLY, enum: Object.values(TargetAvaliationStatusEnum) })
  @IsEnum(TargetAvaliationStatusEnum)
  status: TargetAvaliationStatusEnum
}
