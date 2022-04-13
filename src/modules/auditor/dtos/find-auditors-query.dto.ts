import { EntityStatusEnum } from '../../shared/enums/entity-status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class FindAuditorQueryDto {
  @ApiProperty({ required: false, example: 'lucas' })
  name: string

  @ApiProperty({ required: false, example: '07190909974' })
  documentNumber: string

  @ApiProperty({ required: false, example: EntityStatusEnum.PENDING })
  status: EntityStatusEnum
}
