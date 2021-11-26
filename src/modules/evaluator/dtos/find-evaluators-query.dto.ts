import { EntityStatusEnum } from '@modules/shared/enums'
import { ApiProperty } from '@nestjs/swagger'
import { EvaluatorLicenseType } from '../enums'

export class FindEvaluatorQueryDto {
  @ApiProperty({ required: false, example: 'lucas' })
  name: string

  @ApiProperty({ required: false, example: '07190909974' })
  documentNumber: string

  @ApiProperty({ required: false, example: EntityStatusEnum.PENDING })
  status: EntityStatusEnum

  @ApiProperty({ required: false, example: EvaluatorLicenseType.ADJUNCT })
  type: EvaluatorLicenseType
}
