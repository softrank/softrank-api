import { ExpectedResult } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'

export class ExpectedResultDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  initial: string

  @ApiProperty()
  description: string

  @ApiProperty()
  minLevel: string

  @ApiProperty()
  maxLevel: string

  static fromEntity(expectedResult: ExpectedResult): ExpectedResultDto {
    const dto = new ExpectedResultDto()

    dto.id = expectedResult.id
    dto.name = expectedResult.name
    dto.initial = expectedResult.initial
    dto.maxLevel = expectedResult.maxLevel?.initial
    dto.minLevel = expectedResult.minLevel?.initial
    dto.description = expectedResult.description

    return dto
  }
}
