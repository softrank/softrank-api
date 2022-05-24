import { ExpectedResultDto, ModelDto } from '@modules/shared/dtos/model'
import { ModelProcessTypeEnum } from '@modules/model/enum'
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

  @ApiProperty()
  type: ModelProcessTypeEnum

  @ApiProperty({ type: () => [ExpectedResultDto] })
  expectedResults: ExpectedResultDto[]

  @ApiProperty({ type: () => [ModelDto] })
  model: ModelDto

  static fromEntity(modelProcess: ModelProcess): ModelProcessDto {
    const { expectedResults, model } = modelProcess
    const dto = new ModelProcessDto()

    dto.id = modelProcess.id
    dto.name = modelProcess.name
    dto.initial = modelProcess.initial
    dto.description = modelProcess.description
    dto.type = modelProcess.type

    if (expectedResults) {
      dto.expectedResults = ExpectedResultDto.fromManyEntities(expectedResults)
    }

    if (model) {
      dto.model = ModelDto.fromEntity(model)
    }

    return dto
  }

  static fromManyEntities(modelProcesses: ModelProcess[]): ModelProcessDto[] {
    const modelProcessesDtos = modelProcesses?.map(ModelProcessDto.fromEntity)
    return modelProcessesDtos || []
  }
}
