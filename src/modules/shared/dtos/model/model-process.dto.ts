import { ExpectedResultDto } from '@modules/shared/dtos/model'
import { ModelProcess } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'

export class ModelProcessDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  initial: string

  @ApiProperty()
  description: string

  @ApiProperty({ type: () => [ExpectedResultDto] })
  expectedResults: ExpectedResultDto[]

  static fromEntity(modelProcess: ModelProcess): ModelProcessDto {
    const dto = new ModelProcessDto()

    dto.id = modelProcess.id
    dto.name = modelProcess.name
    dto.initial = modelProcess.initial
    dto.description = modelProcess.description
    dto.expectedResults = modelProcess.expectedResults?.map(ExpectedResultDto.fromEntity)

    return dto
  }
}
