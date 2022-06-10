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
    const { modelLevels, modelProcesses } = model
    const dto = new ModelDto()

    dto.id = model.id
    dto.name = model.name
    dto.year = model.year
    dto.description = model.description

    if (modelLevels) {
      dto.modelLevels = ModelLevelDto.fromManyEntities(modelLevels)
    }

    if (modelProcesses) {
      dto.modelProcesses = ModelProcessDto.fromManyEntities(modelProcesses)
    }

    return dto
  }

  static fromManyEntities(models: Model[]): ModelDto[] {
    const modelsDtos = models?.map(ModelDto.fromEntity)
    return modelsDtos || []
  }
}
