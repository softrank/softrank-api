import { ArrayNotEmpty, IsNotEmpty, IsString, Validate, ValidateNested, IsOptional } from 'class-validator'
import { ModelExpectedResultValidator, ModelLevelValidator } from '@modules/model/validators'
import { setPredecessorModelLevelTransformer } from '@modules/model/transformers'
import { CreateModelProcessDto, CreateModelLevelDto } from '@modules/model/dtos'
import { dateTransformer } from '@modules/shared/transformers'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { stringDate } from '@utils/helpers'
import { CreateModelCapacityDto } from './create-model-capacity.dto'

export class CreateModelDto {
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

  @ApiProperty({ type: () => [CreateModelLevelDto] })
  @Type(() => CreateModelLevelDto)
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested()
  @Transform(setPredecessorModelLevelTransformer)
  @Validate(ModelLevelValidator)
  modelLevels: CreateModelLevelDto[]

  @ApiProperty({ type: () => [CreateModelProcessDto] })
  @Type(() => CreateModelProcessDto)
  @IsOptional()
  @ValidateNested()
  @Validate(ModelExpectedResultValidator)
  modelProcesses: CreateModelProcessDto[]

  @ApiProperty({ type: () => [CreateModelCapacityDto] })
  @Type(() => CreateModelCapacityDto)
  @IsOptional()
  @ValidateNested()
  modelCapacities: CreateModelCapacityDto[]
}
