import { UpdateModelLevelDto, UpdateModelProcessDto } from '@modules/model/dtos'
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from 'class-validator'
import { ModelLevelValidator, ModelExpectedResultValidator } from '@modules/model/validators'
import { setPredecessorModelLevelTransformer } from '@modules/model/transformers'
import { dateTransformer } from '@modules/shared/transformers'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'

export class UpdateModelBodyDto {
  @ApiProperty({
    example: 'SRK-Serviços'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: stringDate() })
  @IsNotEmpty()
  @Transform(dateTransformer)
  year: Date

  @ApiProperty({
    example: 'Uma bela descrição'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ type: () => [UpdateModelLevelDto] })
  @Type(() => UpdateModelLevelDto)
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested()
  @Transform(setPredecessorModelLevelTransformer)
  @Validate(ModelLevelValidator)
  modelLevels: UpdateModelLevelDto[]

  @ApiProperty({ type: () => [UpdateModelProcessDto] })
  @Type(() => UpdateModelProcessDto)
  @ArrayNotEmpty()
  @IsOptional()
  @ValidateNested()
  @Validate(ModelExpectedResultValidator)
  modelProcesses: UpdateModelProcessDto[]
}

export class UpdateModelDto extends UpdateModelBodyDto {
  constructor(updateModelDto: UpdateModelDto) {
    super()
    this.id = updateModelDto.id
    this.name = updateModelDto.name
    this.year = updateModelDto.year
    this.description = updateModelDto.description
    this.modelLevels = updateModelDto.modelLevels
  }

  id: string
}
