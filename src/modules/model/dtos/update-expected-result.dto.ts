import { ExpectedResultEntity } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { v4 } from 'uuid'

export class UpdateExpectedResultDto {
  @ApiProperty({
    example: v4(),
    required: false
  })
  id?: string

  @ApiProperty({
    example: 'Criar o cronograma'
  })
  name: string

  @ApiProperty({
    example: 'GPR-1'
  })
  initial: string

  @ApiProperty({
    example: 'Criar um cronograma detalhado'
  })
  description: string

  @ApiProperty({
    example: 'G'
  })
  minLevel: string

  @ApiProperty({
    example: 'G'
  })
  maxLevel: string

  static toEntity(
    updateExpectedResultDto: UpdateExpectedResultDto
  ): ExpectedResultEntity {
    const expectedResult = new ExpectedResultEntity()

    expectedResult.id = updateExpectedResultDto.id
    expectedResult.name = updateExpectedResultDto.name
    expectedResult.initial = updateExpectedResultDto.initial
    expectedResult.maxLevel = updateExpectedResultDto.maxLevel
    expectedResult.minLevel = updateExpectedResultDto.minLevel
    expectedResult.description = updateExpectedResultDto.description

    return expectedResult
  }
}
