import { EvidenceSourceStatusEnum } from '@modules/evaluation/enums'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SetEvidenceSourceStatusDto {
  constructor(public readonly evidenceSourceId: string, status: EvidenceSourceStatusEnum) {
    this.status = status
  }

  @ApiProperty({ example: EvidenceSourceStatusEnum.COMPLETE })
  @IsEnum(EvidenceSourceStatusEnum)
  @IsNotEmpty()
  status: EvidenceSourceStatusEnum
}
