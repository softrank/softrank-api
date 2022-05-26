import { EvidenceSourceFileStatusEnum } from '@modules/evaluation/enums'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SetEvidenceSourceFileStatusDto {
  constructor(public readonly evidenceSourceFileId: string, status: EvidenceSourceFileStatusEnum) {
    this.status = status
  }

  @ApiProperty({ example: EvidenceSourceFileStatusEnum.COMPLETE })
  @IsEnum(EvidenceSourceFileStatusEnum)
  @IsNotEmpty()
  status: EvidenceSourceFileStatusEnum
}
