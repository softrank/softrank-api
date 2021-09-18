import { IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator'
import { CreateExpectedResultDto } from '@modules/model/dtos'
import { ModelProcess } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateModelProcessDto {
  @ApiProperty({ example: 'Gerencia de Projetos' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'GPR' })
  @IsNotEmpty()
  @IsString()
  initials: string

  @ApiProperty({ example: 'Define a maturidade de gerencia de projetos' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ type: () => [CreateExpectedResultDto] })
  @Type(() => CreateExpectedResultDto)
  @IsOptional()
  @ValidateNested()
  expectedResults: CreateExpectedResultDto[]

  static toEntity(createModelProcessDto: CreateModelProcessDto): ModelProcess {
    const entity = new ModelProcess()

    entity.initials = createModelProcessDto.initials
    entity.name = createModelProcessDto.name
    entity.description = createModelProcessDto.description
    entity.expectedResults = createModelProcessDto.expectedResults?.map(CreateExpectedResultDto.toEntity)

    return entity
  }
}
