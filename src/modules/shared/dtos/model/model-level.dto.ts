import { ModelLevel } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'

export class ModelLevelDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  initial: string

  @ApiProperty()
  name: string

  @ApiProperty()
  predecessor: string

  static fromEntity(modelLevel: ModelLevel): ModelLevelDto {
    const dto = new ModelLevelDto()

    dto.id = modelLevel.id
    dto.name = modelLevel.name
    dto.initial = modelLevel.initial
    dto.predecessor = modelLevel.predecessor

    return dto
  }
}
