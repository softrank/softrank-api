import { ModelProcessDto, ModelLevelDto } from '@modules/shared/dtos/model'
import { Model } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'

export class ModelDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  year: Date

  @ApiProperty()
  description: string

  @ApiProperty({ type: () => [ModelProcessDto] })
  modelProcesses: ModelProcessDto[]

  @ApiProperty({ type: () => [ModelLevelDto] })
  modelLevels: ModelLevelDto[]

  static fromEntity(model: Model): ModelDto {
    const dto = new ModelDto()

    dto.id = model.id
    dto.name = model.name
    dto.year = model.year
    dto.description = model.description
    dto.modelLevels = model.modelLevels?.map(ModelLevelDto.fromEntity)
    dto.modelProcesses = model.modelProcesses?.map(ModelProcessDto.fromEntity)

    return dto
  }
}
