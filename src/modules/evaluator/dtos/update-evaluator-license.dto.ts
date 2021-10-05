import { IsDateString, IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'
import { v4 } from 'uuid'

export class UpdateEvaluatorLicenseDto {
  @ApiProperty({ example: v4() })
  @IsUUID('4')
  @IsOptional()
  id: string

  @ApiProperty({ example: stringDate() })
  @IsDateString()
  @IsNotEmpty()
  expiration: Date

  @ApiProperty({ example: v4() })
  @IsNotEmpty()
  @IsString()
  modelLevelId: string
}
