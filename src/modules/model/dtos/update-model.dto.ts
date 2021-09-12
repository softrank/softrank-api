import { UpdateModelLevelDto, UpdateModelProcessDto } from '@modules/model/dtos'
import { ArrayNotEmpty, IsNotEmpty, IsString, Validate, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { ModelLevelValidator } from '../validators/model-level.validator'
import { ModelExpectedResultValidator } from '../validators/model-expected-result.validator'
import { dateTransformer } from '@modules/shared/transformers'
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
  @Validate(ModelLevelValidator)
  modelLevels: UpdateModelLevelDto[]

  @ApiProperty({ type: () => [UpdateModelProcessDto] })
  @Type(() => UpdateModelProcessDto)
  @ArrayNotEmpty()
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
  }

  id: string
}
