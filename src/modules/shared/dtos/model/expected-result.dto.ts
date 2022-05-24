import { ExpectedResult } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { ModelProcessDto } from './model-process.dto'

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

  @ApiProperty({ type: () => ModelProcessDto })
  modelProcess: ModelProcessDto

  static fromEntity(expectedResult: ExpectedResult): ExpectedResultDto {
    const { maxLevel, minLevel, modelProcess } = expectedResult
    const dto = new ExpectedResultDto()

    dto.id = expectedResult.id
    dto.name = expectedResult.name
    dto.initial = expectedResult.initial
    dto.maxLevel = maxLevel?.initial
    dto.minLevel = minLevel?.initial
    dto.description = expectedResult.description

    if (modelProcess) {
      dto.modelProcess = ModelProcessDto.fromEntity(modelProcess)
    }

    return dto
  }

  static fromManyEntities(expectedResults: ExpectedResult[]): ExpectedResultDto[] {
    const expectedResultsDtos = expectedResults?.map(ExpectedResultDto.fromEntity)
    return expectedResultsDtos || []
  }
}
