import { UpdateModelProcessDto } from '@modules/model/dtos'
import { ModelLevelEntity } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { v4 } from 'uuid'

export class UpdateModelLevelDto {
  @ApiProperty({
    example: v4()
  })
  id: string

  @ApiProperty({
    example: 'G'
  })
  initial: string

  @ApiProperty({
    type: [UpdateModelProcessDto],
    required: false
  })
  modelProcesses?: UpdateModelProcessDto[]

  static toEntity(updateModelLevelDto: UpdateModelLevelDto): ModelLevelEntity {
    const modelLevel = new ModelLevelEntity()

    modelLevel.initial = updateModelLevelDto.initial
    modelLevel.modelProcesses = updateModelLevelDto.modelProcesses?.map(
      UpdateModelProcessDto.toEntity
    )

    return modelLevel
  }
}
