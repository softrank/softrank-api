import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateModelLevelDto } from './create-model-level.dto'
import { ModelEntity } from '../entities/model.entity'

export class CreateModelDto {
  @ApiProperty({
    example: 'SRK-Serviços'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: new Date()
  })
  @IsNotEmpty()
  year: Date

  @ApiProperty({
    example: 'Uma bela descrição'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    type: [CreateModelLevelDto],
    required: false
  })
  modelLevels?: CreateModelLevelDto[]

  static toEntity(createModelDto: CreateModelDto): ModelEntity {
    const model = new ModelEntity()

    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description
    model.modelLevels = createModelDto.modelLevels?.map(
      CreateModelLevelDto.toEntity
    )

    return model
  }
}
