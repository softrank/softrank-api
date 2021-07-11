import { ApiProperty } from '@nestjs/swagger'
import { ExpectedResultEntity } from '../entities/expected-result.entity'

export class CreateExpectedResultDto {
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
    createExpectedResultDto: CreateExpectedResultDto
  ): ExpectedResultEntity {
    const expectedResult = new ExpectedResultEntity()

    expectedResult.name = createExpectedResultDto.name
    expectedResult.initial = createExpectedResultDto.initial
    expectedResult.maxLevel = createExpectedResultDto.maxLevel
    expectedResult.minLevel = createExpectedResultDto.minLevel
    expectedResult.description = createExpectedResultDto.description

    return expectedResult
  }
}
