import { UpdateModelLevelDto } from '@modules/model/dtos'
import { IsNotEmpty, IsString } from 'class-validator'
import { ModelEntity } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateModelBodyDto {
  @ApiProperty({
    example: 'SRK-Serviços-V2'
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
    example: 'Uma bela descrição 2'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    type: [UpdateModelLevelDto],
    required: false
  })
  modelLevels?: UpdateModelLevelDto[]
}

export class UpdateModelDto extends UpdateModelBodyDto {
  constructor(updateModelDto: UpdateModelDto) {
    super()
    this.id = updateModelDto.id
    this.name = updateModelDto.name
    this.year = updateModelDto.year
    this.description = updateModelDto.description
    this.modelLevels = updateModelDto.modelLevels?.map(
      UpdateModelLevelDto.toEntity
    )
  }

  id: string

  static toEntity(updateModelDto: UpdateModelDto): ModelEntity {
    const model = new ModelEntity()

    model.id = updateModelDto.id
    model.name = updateModelDto.name
    model.year = updateModelDto.year
    model.description = updateModelDto.description
    model.modelLevels = updateModelDto.modelLevels?.map(
      UpdateModelLevelDto.toEntity
    )

    return model
  }
}
