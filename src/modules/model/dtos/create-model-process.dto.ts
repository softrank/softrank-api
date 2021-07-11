import { ApiProperty } from '@nestjs/swagger'
import { CreateExpectedResultDto } from './create-expected-result.dto'
import { ModelProcessEntity } from '../entities/model-process.entity'

export class CreateModelProcessDto {
  @ApiProperty({
    example: 'Gerencia de Projetos'
  })
  name: string

  @ApiProperty({
    example: 'GPR'
  })
  initial: string

  @ApiProperty({
    example: 'Responsável por gerenciar o projeto'
  })
  description: string

  @ApiProperty({
    type: [CreateExpectedResultDto],
    required: false
  })
  expectedResults?: CreateExpectedResultDto[]

  static toEntity(
    createModelProcessDto: CreateModelProcessDto
  ): ModelProcessEntity {
    const modelProcess = new ModelProcessEntity()

    modelProcess.name = createModelProcessDto.name
    modelProcess.initial = createModelProcessDto.initial
    modelProcess.description = createModelProcessDto.description
    modelProcess.expectedResults = createModelProcessDto.expectedResults?.map(
      CreateExpectedResultDto.toEntity
    )

    return modelProcess
  }
}
