import { ApiProperty } from '@nestjs/swagger'
import { CreateModelProcessDto } from './create-model-process.dto'
import { ModelLevelEntity } from '../entities/model-level.entity'

export class CreateModelLevelDto {
  @ApiProperty({
    example: 'G'
  })
  initial: string

  @ApiProperty({
    type: [CreateModelProcessDto],
    required: false
  })
  modelProcesses?: CreateModelProcessDto[]

  static toEntity(createModelLevelDto: CreateModelLevelDto): ModelLevelEntity {
    const modelLevel = new ModelLevelEntity()

    modelLevel.initial = createModelLevelDto.initial
    modelLevel.modelProcesses = createModelLevelDto.modelProcesses?.map(
      CreateModelProcessDto.toEntity
    )

    return modelLevel
  }
}
